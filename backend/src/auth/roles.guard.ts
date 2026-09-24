// ============================================================================
// roles.guard.ts
//
// PURPOSE:
//   Enforces role-based access control (RBAC) on routes.
//
// HOW IT WORKS IN ONE LINE:
//   Reads the roles required by a route (set via @Roles(...)) and compares
//   them with the role of the currently authenticated user (req.user.role).
//   If the user doesn't have a required role → 403 Forbidden.
//
// IMPORTANT:
//   This guard DEPENDS on req.user being set, which is done by JwtAuthGuard.
//   So always use them together, in this order:
//       @UseGuards(JwtAuthGuard, RolesGuard)
//   JwtAuthGuard first  → sets req.user
//   RolesGuard  second  → reads req.user
// ============================================================================
//this file actually checks the roles 
import {
  CanActivate,          // Interface every guard must implement (has canActivate)
  ExecutionContext,     // Wrapper around the current request; gives access to
                        // the handler (method) and class (controller)
  ForbiddenException,   // Nest exception → HTTP 403 Forbidden
  Injectable,           // Marks the class as a Nest provider so DI can inject it
} from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Utility to READ metadata attached
                                          // to methods/classes (e.g. @Roles)
import { ROLES_KEY } from './roles.decorator.js'; // The string 'roles' — same key
                                                  // used by @Roles() to WRITE the
                                                  // metadata. We import it here so
                                                  // writer and reader always agree.

@Injectable() // Tells Nest: "This class can be injected, and its constructor
              // dependencies should be resolved automatically."
export class RolesGuard implements CanActivate {
  // --------------------------------------------------------------------------
  // CONSTRUCTOR
  //
  // `private reflector: Reflector` is TypeScript shorthand for:
  //     constructor(reflector: Reflector) { this.reflector = reflector; }
  //
  // Nest's DI container sees `Reflector` as a dependency and gives us an
  // instance automatically. We never call `new Reflector()` ourselves.
  // --------------------------------------------------------------------------
  constructor(private reflector: Reflector) {}

  // --------------------------------------------------------------------------
  // canActivate
  //
  // The ONLY method a guard needs. Nest runs it BEFORE the controller method.
  //   - return true  → request continues to the controller ✅
  //   - return false → request blocked (Nest sends 403) ❌
  //   - throw error  → request blocked with that error ❌
  // --------------------------------------------------------------------------
  canActivate(context: ExecutionContext): boolean {
    // ------------------------------------------------------------------------
    // STEP 1: Find out which roles this route requires.
    //
    // `getAllAndOverride` reads the metadata stored under ROLES_KEY ('roles').
    // We give it TWO targets, in priority order:
    //     1. context.getHandler()  → the specific method being called
    //     2. context.getClass()    → the whole controller class
    //
    // "Override" means: if the method has @Roles(...), use that.
    //                   Otherwise, fall back to the class-level @Roles(...).
    //
    // Result is either:
    //   - an array like ['admin'] or ['admin', 'hr']
    //   - undefined (if no @Roles was used anywhere)
    // ------------------------------------------------------------------------
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // the method (e.g. getAllUsers)
      context.getClass(),   // the controller (e.g. UsersController)
    ]);

    // ------------------------------------------------------------------------
    // STEP 2: If the route didn't specify any roles, DON'T block it.
    //
    // This means routes without @Roles(...) are open to anyone who passed
    // JwtAuthGuard (i.e. any authenticated user). This is the common case
    // for routes like GET /me.
    //
    // We check both:
    //   - !required         → no metadata at all
    //   - required.length===0 → @Roles() called with no arguments
    // ------------------------------------------------------------------------
    if (!required || required.length === 0) {
      return true; // no @Roles() → allow
    }

    // ------------------------------------------------------------------------
    // STEP 3: Get the current HTTP request and the user attached to it.
    //
    // `context.switchToHttp()` → we're dealing with an HTTP request
    //                            (as opposed to WebSocket or GraphQL).
    // `.getRequest()`          → the raw Express/Fastify request object.
    //
    // `request.user` was set earlier by JwtAuthGuard + JwtStrategy.
    // It looks like: { id, name, email, role }
    //
    // ⚠️ If you forget to put JwtAuthGuard BEFORE RolesGuard, `user` will
    //    be undefined and this guard will block everyone.
    // ------------------------------------------------------------------------
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // ------------------------------------------------------------------------
    // STEP 4: The actual decision.
    //
    // Block the request if EITHER:
    //   - there is no user (not authenticated), OR
    //   - the user's role is NOT in the required list.
    //
    // `required.includes(user.role)` → true if the user's role matches ANY
    // of the required roles. Example:
    //     required = ['admin', 'hr']
    //     user.role = 'hr'
    //     includes → true ✅
    //
    // We throw ForbiddenException (HTTP 403) instead of returning false,
    // because:
    //   - 401 = "you're not logged in"        (JwtAuthGuard handles this)
    //   - 403 = "you're logged in, but not allowed here" (this guard)
    // Throwing gives us a clear error message in the response body.
    // ------------------------------------------------------------------------
    if (!user || !required.includes(user.role)) {
      throw new ForbiddenException('Insufficient role');
    }

    // ------------------------------------------------------------------------
    // STEP 5: Everything checks out — let the request continue.
    // ------------------------------------------------------------------------
    return true;
  }
}
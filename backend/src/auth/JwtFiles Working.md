# What This Trio Does — In Plain Words

You have three pieces that work together to make authentication feel effortless in your controllers. Let's walk through each one.

---

## 1. `CurrentUser` decorator

```ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Plain words:**
It's a **shortcut** to grab `request.user` inside a controller.

Without it, you'd write:

```ts
@Get('profile')
getProfile(@Req() req) {
  return req.user;   // 😕 ugly, and you need to type @Req everywhere
}
```

With it:

```ts
@Get('profile')
getProfile(@CurrentUser() user) {
  return user;       // ✅ clean
}
```

**Important:** `request.user` is **not** set automatically. It only exists **after** the `JwtAuthGuard` has run and validated the token. So this decorator is only meaningful on routes that are protected by the guard.

---

## 2. `JwtAuthGuard`

```ts
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Plain words:**
A **bouncer** for your routes. When you put `@UseGuards(JwtAuthGuard)` on a controller or route:

1. It looks at the `Authorization: Bearer <token>` header.
2. Hands the token to the **`jwt` strategy** (the third piece).
3. If valid → the guard **attaches `request.user`** to the request and lets the request through.
4. If invalid/missing → returns **401 Unauthorized** automatically.

It's just `@nestjs/passport`'s built-in guard, wired to your `jwt` strategy by the string `'jwt'`.

---

## 3. `JwtStrategy`

```ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  // ...
  async validate(payload) {
    const user = await this.userModel.findByPk(payload.sub, { ... });
    if (!user) throw new UnauthorizedException('User no longer exists');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
```

**Plain words:**
The **brain** behind the bouncer. Passport calls this automatically whenever the guard runs. It has two responsibilities:

### a) Verify the token's signature
That's done inside `super({...})` using your `JWT_SECRET`. If the signature is wrong or expired, `validate()` is never even called — the guard rejects immediately.

### b) Decide what `req.user` should be
If the token is valid, Passport passes the **decoded payload** into `validate()`. You then:

1. Look up the user in the DB (`findByPk(payload.sub)`) — this is crucial because **the token might be old**, and the user might have been deleted or had their role changed.
2. If the user is gone → throw `UnauthorizedException`.
3. Return a **safe subset** of the user.

> ⚠️ **The most important line to remember:**
> "Whatever you return from `validate()` becomes `req.user`."

So `req.user` ends up being `{ id, name, email, role }` — exactly what your `@CurrentUser()` decorator hands back to the controller.

---

## How They Flow Together

Imagine a request to `GET /auth/profile` protected by `@UseGuards(JwtAuthGuard)`:

```
1. Client sends:   Authorization: Bearer eyJhbG...
                                    │
                                    ▼
2. JwtAuthGuard fires → asks "jwt" strategy to verify
                                    │
                                    ▼
3. JwtStrategy checks signature with JWT_SECRET
       ✅ valid  → decodes payload { sub: 5, role: 'employee' }
       ❌ invalid → 401, stop here
                                    │
                                    ▼
4. JwtStrategy.validate({ sub: 5, role: 'employee' })
       → DB lookup: SELECT id, name, email, role FROM users WHERE id = 5
       → returns { id: 5, name: 'Ahmed', email: 'a@x.com', role: 'employee' }
                                    │
                                    ▼
5. Passport sets: req.user = { id: 5, name: 'Ahmed', ... }
                                    │
                                    ▼
6. Controller receives the request
       @CurrentUser() user   →   { id: 5, name: 'Ahmed', ... }
```

---

## Why split the logic across 3 files?

You might ask: why not just decode the JWT in the controller?

Because each file has **one job**:

| File | Responsibility |
|---|---|
| `JwtStrategy` | "Who is this user, really?" (token → DB → user object) |
| `JwtAuthGuard` | "Should this request be allowed in?" (yes/no + 401) |
| `CurrentUser` | "Give me `req.user` without ceremony" (developer convenience) |

This is the **single responsibility principle** in action. If tomorrow you want to block suspended users, you only touch the strategy. If you want to log every authenticated request, you only touch the guard. The controller stays clean.

---

## One small thing to double-check

Your `JwtStrategy` is registered in `AuthModule`'s `providers` ✅. But make sure:

- `PassportModule` is imported ✅ (you did)
- `JwtModule.registerAsync(...)` with the **same secret** ✅ (you did)

If the secret used to **sign** the token (in `AuthService.login`) is different from the one used to **verify** it (in `JwtStrategy`), every guarded request will 401 — even with a valid token. Since both read from `JWT_SECRET` via `ConfigService`, you're fine.

---

## Summary sentence

> The **strategy** turns a token into a user, the **guard** enforces that this happened, and the **decorator** lets you grab that user in the controller without touching `req` directly.
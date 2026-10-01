# WorkSync Backend

NestJS + PostgreSQL + Sequelize backend for WorkSync.

## Setup

1. Install dependencies:
   ```bash
   npm install

2.   Create .env in the project root:
PORT=4000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

3. Run migrations:
npx sequelize-cli db:migrate

4. Run seeders:
npx sequelize-cli db:seed --seed 20260922092959-departments.cjs
npx sequelize-cli db:seed --seed 20260922094918-users.cjs

5. Start
npm run start:dev

Backend runs at http://localhost:4000.

--Migration Commands--
npx sequelize-cli db:migrate              # run all pending
npx sequelize-cli db:migrate:status       # check status
npx sequelize-cli db:migrate:undo         # undo last
npx sequelize-cli migration:generate --name create-xyz

generated files end in .js. Rename to .cjs (project uses ES modules).


----Seeder Commands----
npx sequelize-cli db:seed --seed <filename>   # run specific seeder
npx sequelize-cli db:seed:undo --seed <filename>  # undo



Seed Users
Email	Password	Role
admin@worksync.com	Password123	admin
ali@worksync.com	Password123	employee
sara@worksync.com	Password123	employee
hina@worksync.com	Password123	employee


Response Format
All responses wrapped:
{ "success": true, "data": { ... } }

Errors:
{ "success": false, "error": { "message": "...", "statusCode": 400 } }

API Endpoints

Auth
Method	Path	Access
POST	/auth/register	Public
POST	/auth/login	Public
GET	/auth/me	Logged-in
GET	/auth/admin-only	Admin


Projects
Method	Path	Access
POST	/projects	Admin
GET	/projects	Logged-in (employee sees own)
GET	/projects/:id	Logged-in
PATCH	/projects/:id	Admin
PATCH	/projects/:id/archive	Admin
DELETE	/projects/:id	Admin
POST	/projects/:id/members	Admin
DELETE	/projects/:id/members/:userId	Admin


Tasks
Method	Path	Access
POST	/tasks	Admin
GET	/tasks	Logged-in (filter, sort, paginate)
GET	/tasks/:id	Logged-in
PATCH	/tasks/:id	Logged-in
DELETE	/tasks/:id	Logged-in
POST	/tasks/:id/comments	Logged-in
Query params for GET /tasks: status, projectId, assignedUserId, sortBy, order, page, limit.

Shifts
Method	Path	Access
POST	/shifts/clock-in	Logged-in
POST	/shifts/clock-out	Logged-in
GET	/shifts/me	Logged-in
GET	/shifts/active	Logged-in


Dashboard
Method	Path	Access
GET	/dashboard	Logged-in
Health
Method	Path	Access
GET	/health/db	Public


Roles:
* admin — full access
* employee — view own projects, view/update tasks in their projects, clock shifts

Project Structure
src/
├── auth/           # JWT strategy, guards, decorators, login/register
├── projects/       # project CRUD, member assignment
├── tasks/          # task CRUD, comments
├── shifts/         # clock in/out
├── dashboard/      # stats
├── models/         # Sequelize models
├── common/         # response interceptor, error filter
├── config/         # Sequelize CLI config
└── database/       # migrations + seeders



END!
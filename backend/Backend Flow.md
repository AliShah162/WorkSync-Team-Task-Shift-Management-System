* this is the flow of what we did till yet

1st: Migration files (build tables/columns)

2nd: Models (describe tables in code)

3rd: Seeder files (insert rows)


* One-Liner to Memorize
Migrate builds the shelf. Models describe the shelf. Seeders fill the shelf.


1. MIGRATIONS  → created the tables and columns (structure)      → npx sequelize-cli db:migrate
2. MODELS      → describe those tables to my TypeScript code     → (no command, just files)
3. SEEDERS     → filled the tables with initial sample data      → npx sequelize-cli db:seed:all
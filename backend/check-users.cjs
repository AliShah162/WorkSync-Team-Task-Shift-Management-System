// backend/check-users.cjs
require('net').setDefaultAutoSelectFamily(false);
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  pool: { max: 2, min: 0, acquire: 30000, idle: 10000 },
  retry: { match: [/Connection terminated unexpectedly/], max: 3 },
  logging: false,
});

(async () => {
  try {
    const [rows] = await sequelize.query(
      'SELECT id, name, email, role, department_id FROM users ORDER BY id;'
    );
    console.log(rows);
  } catch (err) {
    console.error('Query failed:', err.message);
  } finally {
    await sequelize.close();
  }
})();

require('net').setDefaultAutoSelectFamily(false);
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});

(async () => {
  const [rows] = await sequelize.query('SELECT * FROM project_members;');
  console.log(rows);
  await sequelize.close();
})();
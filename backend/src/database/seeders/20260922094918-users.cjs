'use strict';
//seeders are used to insert data like bulk data.
const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface) {
    // Hash the password once — all seed users share the same password
    const hashedPassword = await bcrypt.hash('Password123', 10);

    // Look up department IDs by name so we don't hardcode them
    const [departments] = await queryInterface.sequelize.query(
      'SELECT id, name FROM departments;'
    );

    const byName = Object.fromEntries(departments.map((d) => [d.name, d.id]));
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        name: 'Admin User',
        email: 'admin@worksync.com',
        password: hashedPassword,
        role: 'admin',
        department_id: byName['Engineering'],
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Ali Employee',
        email: 'ali@worksync.com',
        password: hashedPassword,
        role: 'employee',
        department_id: byName['Engineering'],
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Sara Designer',
        email: 'sara@worksync.com',
        password: hashedPassword,
        role: 'employee',
        department_id: byName['Design'],
        created_at: now,
        updated_at: now,
      },
      {
        name: 'Hina Marketer',
        email: 'hina@worksync.com',
        password: hashedPassword,
        role: 'employee',
        department_id: byName['Marketing'],
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
// src/database/seeders/XXXXXX-departments.cjs
'use strict';

module.exports = {
  //this is to create the different departments.
  async up(queryInterface) {
    await queryInterface.bulkInsert('departments', [
      { name: 'Engineering', created_at: new Date(), updated_at: new Date() },
      { name: 'Design',      created_at: new Date(), updated_at: new Date() },
      { name: 'Marketing',   created_at: new Date(), updated_at: new Date() },
      { name: 'HR',          created_at: new Date(), updated_at: new Date() },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('departments', null, {});
  },
};
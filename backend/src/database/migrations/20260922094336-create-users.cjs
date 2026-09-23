'use strict';
//migrations files are used to create tables
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('admin', 'employee'),
        allowNull: false,
        defaultValue: 'employee',
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { //this is the part where we connect user table with deparments!
          model: 'departments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        //This line tells Postgres to set the column's default value to the current date and time, using Postgres's own clock — not JavaScript's.
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        //same
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    // Postgres requires explicit ENUM cleanup
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
  },
};

//1) dropTable('users') removes the table — but the ENUM type (enum_users_role) is a separate thing, so it stays behind.

//2) DROP TYPE IF EXISTS "enum_users_role" removes that leftover ENUM type — otherwise the next db:migrate would fail with "type already exists".
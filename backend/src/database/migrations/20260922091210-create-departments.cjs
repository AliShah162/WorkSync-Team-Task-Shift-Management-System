'use strict';
//migrations files are used to create tables
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('departments', {
      //these are the fields:
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('departments');
  },
};

//down is used to rollback changes what up did. Like reverse the changes.

// we use this "npx sequelize-cli db:migrate" to actullay make this code run and create the column
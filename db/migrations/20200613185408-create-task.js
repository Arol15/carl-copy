'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tasks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      taskDescription: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      dueDate: {
        type: Sequelize.DATEONLY
      },
      columnId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: 'Columns' },
      },
      columnIndx: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tasks');
  }
};

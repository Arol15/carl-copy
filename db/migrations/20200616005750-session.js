'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('session', {
      sid: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      sess: {
        allowNull: false,
        type: Sequelize.JSON,
      },
      expire: {
        allowNull: false,
        type: 'TIMESTAMP(6)'
      },
    }).then(() => {
      queryInterface.addIndex('session', ['expire'], { name: 'IDX_session_expire' })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('session');
  }
};

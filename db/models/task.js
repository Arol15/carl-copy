'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    taskDescription: {
      allowNull: false,
      type: DataTypes.STRING(255),
    },
    dueDate: {
      type: DataTypes.DATEONLY,
    },
    columnId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Column' },
    },
    columnIndx: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.Column, { foreignKey: 'columnId' });
  };
  return Task;
};

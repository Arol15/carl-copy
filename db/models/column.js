'use strict';
module.exports = (sequelize, DataTypes) => {
  const Column = sequelize.define('Column', {
    columnName: {
      allowNull: false,
      type: DataTypes.STRING(75),
    },
    columnPos: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    projectId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Project' }
    },
  }, {});
  Column.associate = function(models) {
    Column.belongsTo(models.Project, { foreignKey: 'projectId' });
    Column.hasMany(models.Task, { foreignKey: 'columnId', onDelete: 'CASCADE', hooks: true });
  };
  return Column;
};

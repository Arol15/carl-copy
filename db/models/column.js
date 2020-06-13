'use strict';
module.exports = (sequelize, DataTypes) => {
  const Column = sequelize.define('Column', {
    columnName: {
      allowNull: false,
      type: DataTypes.STRING(75),
    },
    projectId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Project' }
    },
  }, {});
  Column.associate = function(models) {
    Column.belongsTo(models.Project, { foreignKey: 'projectId' });
    Column.hasMany(models.Task, { foreignKey: 'columnId' });
  };
  return Column;
};

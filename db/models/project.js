'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    projectName: {
      allowNull: false,
      type: DataTypes.STRING(75),
    },
    teamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Teams' }
    },
  }, {});
  Project.associate = function(models) {
    Project.belongsTo(models.Team, { foreignKey: 'teamId' });
    Project.hasMany(models.Column, { foreignKey: 'projectId' });
  };
  return Project;
};

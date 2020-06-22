'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    teamName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    }
  }, {});
  Team.associate = function(models) {
    Team.hasMany(models.User, { foreignKey: 'teamId'}),
    Team.hasMany(models.Project, { foreignKey: 'teamId', onDelete: 'CASCADE', hooks: true })
  };
  return Team;
};

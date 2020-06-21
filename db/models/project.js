'use strict';
module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    projectName: {
      allowNull: false,
      type: DataTypes.STRING(75),
      validate: {
        notEmpty: {
          msg: 'Project name cannot be empty'
        },
        notNull: {
          msg: 'Project name cannot be empty'
        },
        len: {
          args: [0, 75],
          msg: 'Project name must not be less than 0 or more than 75 characters'
        }
      },
    },
    teamId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      references: { model: 'Teams' },
      validate: {
        notEmpty: {
          msg: 'Team ID cannot be empty'
        },
        notNull: {
          msg: 'Team ID cannot be empty'
        },
      }
    },
  }, {});
  Project.associate = function(models) {
    Project.belongsTo(models.Team, { foreignKey: 'teamId' });
    Project.hasMany(models.Column, { foreignKey: 'projectId', onDelete: 'CASCADE', hooks: true });
  };
  return Project;
};

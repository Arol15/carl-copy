'use strict';
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(20),
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(75),
      unique: true,
    },
    teamId: {
      type: DataTypes.INTEGER,
      references: { model: 'Teams' }
    }
  }, {});
  User.associate = function(models) {
    User.belongsTo(models.Team, { foreignKey: 'teamId' })
  };

  User.prototype.validatePassword = function (password) {
    // because this is a model instance method, `this` is the user instance here:
    return bcrypt.compareSync(password, this.hashedPassword.toString())
  }

  return User;
};

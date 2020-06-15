'use strict';
const bcrypt = require('bcryptjs')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(20),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a value for First Name.'
        },
        len: {
          args: [2, 20],
          msg: 'First name must be between 2 and 20 characters long.'
        },
      },
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING(50),
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a value for Last Name.'
        },
        len: {
          args: [2, 50],
          msg: 'Last name must be between 2 and 50 characters long.'
        },
      },
    },
    hashedPassword: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a value for Password.'
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/g,
          msg: 'Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*").'
        },
        len: {
          args: [4, 100],
          msg: 'Password must not be more than 100 characters.'
        },
      },
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(75),
      unique: true,
      validate: {
        notEmpty: {
          args: true,
          msg: 'Please provide a value for email.'
        },
        len: {
          args: [2, 255],
          msg: 'Last name must be between 2 and 255 characters long.'
        },
        isEmail: {
          args: true,
          msg: 'Email address is not a valid email.'
        },
      },
    },
    teamId: {
      type: DataTypes.INTEGER,
      references: { model: 'Teams' }
    }
  }, {});

  User.beforeCreate(async user => {
    return user.hashedPassword = await bcrypt.hash(user.hashedPassword, 15)
  });

  User.associate = function(models) {
    User.belongsTo(models.Team, { foreignKey: 'teamId' })
  };

  User.prototype.validatePassword = async function (password) {
    // because this is a model instance method, `this` is the user instance here:
    return bcrypt.compare(password, this.hashedPassword.toString())
  }

  return User;
};

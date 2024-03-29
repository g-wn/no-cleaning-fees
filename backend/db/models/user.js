'use strict';
const { Model, Validator } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    toSafeObject() {
      const { id, firstName, lastName, username, email } = this;
      return { id, firstName, lastName, username, email };
    }

    validatePassword(password) {
      return bcrypt.compareSync(password, this.hashedPassword.toString());
    }

    static getCurrentUserById(id) {
      return User.scope('currentUser').findByPk(id);
    }

    static async login({ credential, password }) {
      const { Op } = require('sequelize');
      const user = await User.scope('loginUser').findOne({
        where: {
          [Op.or]: {
            username: credential,
            email: credential
          }
        }
      });
      if (user && user.validatePassword(password)) {
        return await User.scope('currentUser').findByPk(user.id);
      }
    }

    static async signup({ firstName, lastName, email, username, password }) {
      const hashedPassword = bcrypt.hashSync(password);
      const user = await User.create({
        firstName,
        lastName,
        email,
        username,
        hashedPassword
      });
      return await User.scope('currentUser').findByPk(user.id);
    }

    static associate(models) {
      const bookingColumnMap = {
        through: models.Booking,
        foreignKey: 'userId',
        otherKey: 'spotId'
      };

      const reviewColumnMap = {
        through: models.Review,
        foreignKey: 'userId',
        otherKey: 'spotId'
      };

      User.hasMany(models.Booking, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
      User.hasMany(models.Review, { foreignKey: 'userId', onDelete: 'CASCADE', hooks: true });
      User.hasMany(models.Spot, { foreignKey: 'ownerId', as: 'Owner', onDelete: 'CASCADE', hooks: true });

      User.belongsToMany(models.Spot, bookingColumnMap);
      User.belongsToMany(models.Spot, reviewColumnMap);
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error('Cannot be an email.');
            }
          }
        }
      },
      avatar: { type: DataTypes.STRING, allowNull: false },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ['hashedPassword', 'email', 'updatedAt', 'createdAt']
        }
      },
      scopes: {
        currentUser: {
          attributes: {
            exclude: ['hashedPassword']
          }
        },
        loginUser: {
          attributes: {}
        }
      }
    }
  );
  return User;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      Review.hasMany(models.ReviewImage, { foreignKey: 'reviewId' });

      Review.belongsTo(models.User, { foreignKey: 'userId' });
      Review.belongsTo(models.Spot, { foreignKey: 'spotId' });
    }
  }
  Review.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      spotId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      firstName: DataTypes.STRING,
      review: DataTypes.STRING,
      stars: { type: DataTypes.INTEGER, allowNull: false }
    },
    {
      sequelize,
      indexes: [{ type: 'unique', fields: ['userId', 'spotId'] }],
      modelName: 'Review'
    }
  );
  return Review;
};

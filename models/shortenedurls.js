'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shortenedUrls extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  shortenedUrls.init({
    email: DataTypes.STRING,
    longerUrl: DataTypes.STRING,
    shorterUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'shortenedUrls',
  });
  return shortenedUrls;
};
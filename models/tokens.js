'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tokens.init({
    email: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    expired: DataTypes.INTEGER,
    used: DataTypes.INTEGER,
    tokenValue: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};
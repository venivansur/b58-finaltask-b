'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class provinsi_tb extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  provinsi_tb.init({
    provinsi_name: DataTypes.STRING,
    inaugurated: DataTypes.DATE,
    image: DataTypes.STRING,
    island: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'provinsi_tb',
  });
  return provinsi_tb;
};
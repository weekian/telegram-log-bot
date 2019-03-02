"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(sequelize, DataTypes) {
  return sequelize.define("person", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  });
};

exports.default = _default;
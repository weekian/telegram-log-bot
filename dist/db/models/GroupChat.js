"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(sequelize, DataTypes) {
  return sequelize.define("chat", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  });
};

exports.default = _default;
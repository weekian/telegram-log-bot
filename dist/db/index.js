"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _default = function _default(url, env) {
  return new _bluebird.default(function (resolve, reject) {
    // ---------- Database Initialization ----------
    var db = new _sequelize.default(url, {
      timezone: "+08:00"
    }); // ---------- Model Definitions ----------------

    var Person = db.import("".concat(__dirname, "/models/person"));
    var Session = db.import("".concat(__dirname, "/models/session"));
    var GroupChat = db.import("".concat(__dirname, "/models/GroupChat")); // ---------- Model Association ----------------

    GroupChat.belongsToMany(Person, {
      through: "member"
    });
    Person.belongsToMany(GroupChat, {
      through: "member"
    }); // Defines one to many relationship for Person has many session and session belongs to one Person

    Session.hasOne(Person);
    Person.hasMany(Session); // ---------- (Optional) Creation of tables ----

    var forceDrop = env !== "production";
    db.sync({
      force: forceDrop
    }).then(function () {
      resolve({
        db: db,
        Person: Person,
        Session: Session,
        GroupChat: GroupChat
      });
    }).catch(function (err) {
      return reject(err);
    });
  });
};

exports.default = _default;
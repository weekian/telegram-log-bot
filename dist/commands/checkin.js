"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _default = {
  name: "checkin",
  process: function () {
    var _process = (0, _bluebird.coroutine)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(_ref) {
      var message, from, database, Person, GroupChat, Session;
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              message = _ref.message, from = _ref.from, database = _ref.database, Person = _ref.Person, GroupChat = _ref.GroupChat, Session = _ref.Session;
              return _context.abrupt("return", "checkin");

            case 2:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function process(_x) {
      return _process.apply(this, arguments);
    }

    return process;
  }()
};
exports.default = _default;
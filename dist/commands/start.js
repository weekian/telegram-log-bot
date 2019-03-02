"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _bluebird = require("bluebird");

var _default = {
  name: "start",
  process: function () {
    var _process = (0, _bluebird.coroutine)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee(_ref) {
      var from, Person, _ref2, _ref3, person, isCreated, greeting, introduction;

      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              from = _ref.from, Person = _ref.Person;
              _context.next = 3;
              return Person.findOrCreate({
                where: {
                  id: from.id,
                  name: from.first_name
                }
              });

            case 3:
              _ref2 = _context.sent;
              _ref3 = (0, _slicedToArray2.default)(_ref2, 2);
              person = _ref3[0];
              isCreated = _ref3[1];
              greeting = isCreated ? "Hi ".concat(person.name, ",") : "Welcome back ".concat(person.name, ",");
              introduction = "\n\nIn a private chat, /checkin to begin a session. /checkout to end a session\n\nAdd me to a group chat and send /leaderboard to track everybody's logged sessions.\n\n/help to see all the other commands\n\nRemember, you are what you are willing to struggle for.\n\nGood luck!";
              return _context.abrupt("return", greeting.concat(introduction));

            case 10:
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
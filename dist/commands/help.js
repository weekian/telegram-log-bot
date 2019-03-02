"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _default = {
  name: "help",
  process: function () {
    var _process = (0, _bluebird.coroutine)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      return _regenerator.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", "In a private chat, /checkin to start a session. When you are done, /checkout to end that session.\n\n/manual to log a session if you forgot to start or end a session.\n\n/all to list all your logged sessions and /skip to use your free monthly cheat day.\n\nAdd me to a group chat to track the rest of the members and see how many sessions they have logged.\n\nGood luck!");

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function process() {
      return _process.apply(this, arguments);
    }

    return process;
  }()
};
exports.default = _default;
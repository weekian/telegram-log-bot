"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _telegraf = _interopRequireDefault(require("telegraf"));

var _server = _interopRequireDefault(require("./server"));

var _bot = _interopRequireDefault(require("./bot"));

var _db = _interopRequireDefault(require("./db"));

var _start = _interopRequireDefault(require("./commands/start"));

var _checkin = _interopRequireDefault(require("./commands/checkin"));

var _checkout = _interopRequireDefault(require("./commands/checkout"));

var _manual = _interopRequireDefault(require("./commands/manual"));

var _all = _interopRequireDefault(require("./commands/all"));

var _skip = _interopRequireDefault(require("./commands/skip"));

var _leaderboard = _interopRequireDefault(require("./commands/leaderboard"));

var _help = _interopRequireDefault(require("./commands/help"));

var _groupHandler = _interopRequireDefault(require("./commands/groupHandler"));

// Entrypoint to starting bot application
(0, _bluebird.coroutine)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var _process$env, PORT, NODE_ENV, TELEGRAM_TOKEN, DATABASE_URL, database, server, bot;

  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _process$env = process.env, PORT = _process$env.PORT, NODE_ENV = _process$env.NODE_ENV, TELEGRAM_TOKEN = _process$env.TELEGRAM_TOKEN, DATABASE_URL = _process$env.DATABASE_URL;
          _context.next = 3;
          return (0, _db.default)(DATABASE_URL, NODE_ENV);

        case 3:
          database = _context.sent;
          server = new _server.default(PORT, NODE_ENV);
          bot = new _bot.default(_telegraf.default, TELEGRAM_TOKEN, NODE_ENV, database, _groupHandler.default, [_help.default, _start.default], [_checkin.default, _checkout.default, _manual.default, _all.default, _skip.default], [_leaderboard.default]);
          _context.next = 8;
          return bot.start();

        case 8:
          server.start();

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this);
}))();
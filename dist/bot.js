"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _bluebird = require("bluebird");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/*
Note
If ctx.message.group_chat_created is true means create with group chat
If ctx.message.new_chat_members contains bot then is added to group chat
If ctx.message.left_chat_member is bot's id then bot is deleted
 */
var Bot =
/*#__PURE__*/
function () {
  function Bot(Telegram, token, env, database, addedToGroupHandler) {
    var commands = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : [];
    var privateCommands = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
    var groupCommands = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : [];
    (0, _classCallCheck2.default)(this, Bot);
    // Initialize Telegram Bot
    this.bot = new Telegram(token); // Store database object and related Models

    this.database = database.db;
    this.Person = database.Person;
    this.GroupChat = database.GroupChat;
    this.Session = database.Session; // Registering of telegram commands

    this.registerPrivateCommands(privateCommands);
    this.registerGroupCommands(groupCommands);
    this.registerCommands(commands);
    this.handleAddedToGroup(addedToGroupHandler);
  } // Command handlers for all types of chats


  (0, _createClass2.default)(Bot, [{
    key: "registerCommands",
    value: function registerCommands(commands) {
      var _this = this;

      commands.forEach(function (command) {
        _this.bot.command(command.name,
        /*#__PURE__*/
        function () {
          var _ref = (0, _bluebird.coroutine)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee(ctx) {
            return _regenerator.default.wrap(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    _context.t0 = ctx;
                    _context.next = 3;
                    return command.process({
                      message: ctx.message,
                      from: ctx.from,
                      database: _this.database,
                      Person: _this.Person,
                      GroupChat: _this.GroupChat,
                      Session: _this.Session
                    });

                  case 3:
                    _context.t1 = _context.sent;

                    _context.t0.reply.call(_context.t0, _context.t1);

                  case 5:
                  case "end":
                    return _context.stop();
                }
              }
            }, _callee, this);
          }));

          return function (_x) {
            return _ref.apply(this, arguments);
          };
        }());
      }, this);
    } // Command handlers for private chats

  }, {
    key: "registerPrivateCommands",
    value: function registerPrivateCommands(privateCommands) {
      var _this2 = this;

      privateCommands.forEach(function (command) {
        _this2.bot.command(command.name,
        /*#__PURE__*/
        function () {
          var _ref2 = (0, _bluebird.coroutine)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee2(ctx) {
            return _regenerator.default.wrap(function _callee2$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!_this2.isPrivateChat(ctx.chat)) {
                      _context2.next = 8;
                      break;
                    }

                    _context2.t0 = ctx;
                    _context2.next = 4;
                    return command.process({
                      message: ctx.message,
                      from: ctx.from,
                      database: _this2.database,
                      Person: _this2.Person,
                      GroupChat: _this2.GroupChat,
                      Session: _this2.Session
                    });

                  case 4:
                    _context2.t1 = _context2.sent;

                    _context2.t0.reply.call(_context2.t0, _context2.t1);

                    _context2.next = 9;
                    break;

                  case 8:
                    ctx.reply("Oops, this command is reserved for private chats only. /help if unsure");

                  case 9:
                  case "end":
                    return _context2.stop();
                }
              }
            }, _callee2, this);
          }));

          return function (_x2) {
            return _ref2.apply(this, arguments);
          };
        }());
      }, this);
    } // Command handlers for group chats

  }, {
    key: "registerGroupCommands",
    value: function registerGroupCommands(groupCommands) {
      var _this3 = this;

      groupCommands.forEach(function (command) {
        _this3.bot.command(command.name,
        /*#__PURE__*/
        function () {
          var _ref3 = (0, _bluebird.coroutine)(
          /*#__PURE__*/
          _regenerator.default.mark(function _callee3(ctx) {
            return _regenerator.default.wrap(function _callee3$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    if (_this3.isPrivateChat(ctx.chat)) {
                      _context3.next = 8;
                      break;
                    }

                    _context3.t0 = ctx;
                    _context3.next = 4;
                    return command.process({
                      database: _this3.database,
                      Person: _this3.Person,
                      GroupChat: _this3.GroupChat,
                      Session: _this3.Session
                    });

                  case 4:
                    _context3.t1 = _context3.sent;

                    _context3.t0.reply.call(_context3.t0, _context3.t1);

                    _context3.next = 9;
                    break;

                  case 8:
                    ctx.reply("Oops, this command is reserved for group chats only. /help if unsure");

                  case 9:
                  case "end":
                    return _context3.stop();
                }
              }
            }, _callee3, this);
          }));

          return function (_x3) {
            return _ref3.apply(this, arguments);
          };
        }());
      }, this);
    } // Command handlers for add to group

  }, {
    key: "handleAddedToGroup",
    value: function handleAddedToGroup(handler) {
      var _this4 = this;

      this.bot.on("message",
      /*#__PURE__*/
      function () {
        var _ref4 = (0, _bluebird.coroutine)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee4(ctx) {
          return _regenerator.default.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  if (!_this4.isAddedToGroupChat(ctx.message)) {
                    _context4.next = 6;
                    break;
                  }

                  _context4.t0 = ctx;
                  _context4.next = 4;
                  return handler.process({
                    database: _this4.database,
                    Person: _this4.Person,
                    GroupChat: _this4.GroupChat,
                    Session: _this4.Session
                  });

                case 4:
                  _context4.t1 = _context4.sent;

                  _context4.t0.reply.call(_context4.t0, _context4.t1);

                case 6:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4, this);
        }));

        return function (_x4) {
          return _ref4.apply(this, arguments);
        };
      }());
    }
  }, {
    key: "isAddedToGroupChat",
    value: function isAddedToGroupChat(message) {
      var _this5 = this;

      return !!message && (message.group_chat_created || !!message.new_chat_members && message.new_chat_members.some(function (e) {
        return e.id === _this5.bot.options.id;
      }));
    }
  }, {
    key: "isPrivateChat",
    value: function isPrivateChat(chat) {
      return !!chat && chat.type === "private";
    }
  }, {
    key: "start",
    value: function () {
      var _start = (0, _bluebird.coroutine)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5() {
        var botInfo;
        return _regenerator.default.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.bot.telegram.getMe();

              case 2:
                botInfo = _context5.sent;
                this.bot.options.username = botInfo.username;
                this.bot.options.id = botInfo.id; // Starts listening for messages

                this.bot.startPolling();

              case 6:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function start() {
        return _start.apply(this, arguments);
      }

      return start;
    }()
  }]);
  return Bot;
}();

exports.default = Bot;
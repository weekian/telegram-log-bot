"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

// Server is required as Heroku requires application to listen to
// $PORT env variable. Heroku will close the application otherwise.
var Server =
/*#__PURE__*/
function () {
  function Server(port, environment) {
    (0, _classCallCheck2.default)(this, Server);
    this.app = (0, _express.default)();
    this.port = port;
    var logFormat = environment === "production" ? "common" : "dev";
    this.app.use((0, _morgan.default)(logFormat)); // Generic endpoint for uptime robot to send request to
    // Ensures application is kept 'hot'

    this.app.get("/", function (req, res) {
      res.send("hello world");
    });
  }

  (0, _createClass2.default)(Server, [{
    key: "start",
    value: function start() {
      this.app.listen(this.port);
    }
  }]);
  return Server;
}();

exports.default = Server;
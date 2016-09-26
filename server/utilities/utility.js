'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateToken = generateToken;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function generateToken() {
  return _q2.default.promise(function (resolve, reject) {
    _crypto2.default.randomBytes(20, function (err, buf) {
      var token = buf.toString('hex');
      resolve(token);
    });
  });
}
//# sourceMappingURL=utility.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubscriptionSchema = new _mongoose2.default.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    required: true
  },
  address: {
    type: String,
    required: true
  }
});
SubscriptionSchema.path('email').validate(function (email) {
  var emailRegex = /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email); // Assuming email has a text attribute
}, 'The e-mail field cannot be empty.');

exports.default = _mongoose2.default.model('Subscription', SubscriptionSchema);
//# sourceMappingURL=subscription.model.js.map

/**
 * Subscription model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _subscription = require('./subscription.model');

var _subscription2 = _interopRequireDefault(_subscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubscriptionEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
SubscriptionEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _subscription2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    SubscriptionEvents.emit(event + ':' + doc._id, doc);
    SubscriptionEvents.emit(event, doc);
  };
}

exports.default = SubscriptionEvents;
//# sourceMappingURL=subscription.events.js.map

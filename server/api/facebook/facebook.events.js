/**
 * Facebook model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _facebook = require('./facebook.model');

var _facebook2 = _interopRequireDefault(_facebook);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FacebookEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
FacebookEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _facebook2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    FacebookEvents.emit(event + ':' + doc._id, doc);
    FacebookEvents.emit(event, doc);
  };
}

exports.default = FacebookEvents;
//# sourceMappingURL=facebook.events.js.map

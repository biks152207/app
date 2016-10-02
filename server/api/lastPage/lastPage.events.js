/**
 * LastPage model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _lastPage = require('./lastPage.model');

var _lastPage2 = _interopRequireDefault(_lastPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LastPageEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
LastPageEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _lastPage2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    LastPageEvents.emit(event + ':' + doc._id, doc);
    LastPageEvents.emit(event, doc);
  };
}

exports.default = LastPageEvents;
//# sourceMappingURL=lastPage.events.js.map

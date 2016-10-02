/**
 * Note model events
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _note = require('./note.model');

var _note2 = _interopRequireDefault(_note);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoteEvents = new _events.EventEmitter();

// Set max event listeners (0 == unlimited)
NoteEvents.setMaxListeners(0);

// Model events
var events = {
  save: 'save',
  remove: 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  _note2.default.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function (doc) {
    NoteEvents.emit(event + ':' + doc._id, doc);
    NoteEvents.emit(event, doc);
  };
}

exports.default = NoteEvents;
//# sourceMappingURL=note.events.js.map

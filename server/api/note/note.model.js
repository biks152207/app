'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NoteSchema = new _mongoose2.default.Schema({
  name: String,
  user: { type: _mongoose.Schema.Types.ObjectId, ref: 'User' }
});

exports.default = _mongoose2.default.model('Note', NoteSchema);
//# sourceMappingURL=note.model.js.map

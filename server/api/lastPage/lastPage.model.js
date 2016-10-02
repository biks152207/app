'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LastPageSchema = new _mongoose2.default.Schema({
  name: String,
  user: { type: _mongoose.Schema.Types.ObjectId, ref: 'User' }
});

exports.default = _mongoose2.default.model('LastPage', LastPageSchema);
//# sourceMappingURL=lastPage.model.js.map

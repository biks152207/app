'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UploadSchema = new _mongoose2.default.Schema({
  originalname: String,
  category: { type: _mongoose.Schema.Types.ObjectId, ref: 'Category' },
  path: String,
  description: String

});

exports.default = _mongoose2.default.model('Upload', UploadSchema);
//# sourceMappingURL=upload.model.js.map

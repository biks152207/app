'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uploader = Uploader;

var _formidable = require('formidable');

var _formidable2 = _interopRequireDefault(_formidable);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create incoming form object
var form = new _formidable2.default.IncomingForm();
// Allows multiple file to upload
form.multiples = true;

// Upload all the files in the /upload directory
form.uploadDir = _path2.default.join(__dirname, '/uploads');

function Uploader(req) {
  var deferred = _q2.default.defer();

  // Every time a file has been uploaded successfully
  // Rename the file to it's original name
  form.on('file', function (field, file) {
    fs.rename(file.path, _path2.default.join(form.uploadDir, file.name));
  });

  // Logs any error while uploading
  form.on('error', function (error) {
    console.log('An error occurred: \n' + error);
    deferred.reject();
  });

  // Once all the files have been uploaded, send the reponse to the client
  form.on('end', function () {
    deferred.resolve();
  });
  // Parse the incoming request containing the form data
  form.parse(req);
}
//# sourceMappingURL=file.js.map

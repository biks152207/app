/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/uploads              ->  index
 * POST    /api/uploads              ->  create
 * GET     /api/uploads/:id          ->  show
 * PUT     /api/uploads/:id          ->  upsert
 * PATCH   /api/uploads/:id          ->  patch
 * DELETE  /api/uploads/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

exports.index = index;
exports.show = show;
exports.create = create;
exports.upsert = upsert;
exports.patch = patch;
exports.destroy = destroy;

var _fastJsonPatch = require('fast-json-patch');

var _fastJsonPatch2 = _interopRequireDefault(_fastJsonPatch);

var _upload = require('./upload.model');

var _upload2 = _interopRequireDefault(_upload);

var _file = require('../../utilities/file');

var _file2 = _interopRequireDefault(_file);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var upload = (0, _multer2.default)({ dest: './server/uploads/' }).array('photoes', 4);

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function (entity) {
    if (entity) {
      return res.status(statusCode).json(entity);
    }
    return null;
  };
}

function patchUpdates(patches) {
  return function (entity) {
    try {
      _fastJsonPatch2.default.apply(entity, patches, /*validate*/true);
    } catch (err) {
      return _promise2.default.reject(err);
    }

    return entity.save();
  };
}

function removeEntity(res) {
  return function (entity) {
    if (entity) {
      return entity.remove().then(function () {
        res.status(204).end();
      });
    }
  };
}

function handleEntityNotFound(res) {
  return function (entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    res.status(statusCode).send(err);
  };
}

// Gets a list of Uploads
function index(req, res) {
  return _upload2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Upload from the DB
function show(req, res) {
  return _upload2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Upload in the DB
function create(req, res) {
  upload(req, res, function (err) {
    if (err) {
      console.log(err);
      console.log('Error Occured');
      return;
    }
    var bucket = [];
    for (var i in req.files) {
      req.files[i].category = (0, _typeof3.default)(req.body.fileDetails.category) === 'object' ? req.body.fileDetails.category[i] : req.body.fileDetails.category;
      if (req.files[i].description) {
        req.files[i].description = (0, _typeof3.default)(req.body.fileDetails.description) === 'object' ? req.body.fileDetails.description[i] : req.body.fileDetails.description;
      }
      var newfiles = new _upload2.default(req.files[i]);
      bucket.push(_q2.default.nfcall(newfiles.save.bind(newfiles)));
    }
    return _q2.default.all(bucket).then(function (result) {
      res.json({ message: 'Succesfully uploaded' });
    }).catch(handleError(res));
    // res.end('Your Files Uploaded');
    // console.log('Photo Uploaded');
  });
}

// Upserts the given Upload in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _upload2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Upload in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _upload2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Upload from the DB
function destroy(req, res) {
  return _upload2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=upload.controller.js.map

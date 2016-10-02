/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/lastPages              ->  index
 * POST    /api/lastPages              ->  create
 * GET     /api/lastPages/:id          ->  show
 * PUT     /api/lastPages/:id          ->  upsert
 * PATCH   /api/lastPages/:id          ->  patch
 * DELETE  /api/lastPages/:id          ->  destroy
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

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

var _lastPage = require('./lastPage.model');

var _lastPage2 = _interopRequireDefault(_lastPage);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

// Gets a list of LastPages
function index(req, res) {
  return _lastPage2.default.findOne().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single LastPage from the DB
function show(req, res) {
  return _lastPage2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new LastPage in the DB
function create(req, res) {
  if (req.user._id) {
    var lastPageObject = _lodash2.default.merge({ name: req.body.name }, { user: req.user._id });
    console.log(req.user);
    return _lastPage2.default.findOneAndUpdate({ _id: req.user._id }, lastPageObject, { upsert: true }).exec().then(respondWithResult(res)).catch(handleError(res));
  }
}

// Upserts the given LastPage in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _lastPage2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing LastPage in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _lastPage2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a LastPage from the DB
function destroy(req, res) {
  return _lastPage2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=lastPage.controller.js.map

/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/notes              ->  index
 * POST    /api/notes              ->  create
 * GET     /api/notes/:id          ->  show
 * PUT     /api/notes/:id          ->  upsert
 * PATCH   /api/notes/:id          ->  patch
 * DELETE  /api/notes/:id          ->  destroy
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

var _note = require('./note.model');

var _note2 = _interopRequireDefault(_note);

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

// Gets a list of Notes
function index(req, res) {
  return _note2.default.find({ user: req.user._id }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Note from the DB
function show(req, res) {
  return _note2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Note in the DB
function create(req, res) {
  if (req.user._id) {
    var noteObject = _lodash2.default.merge({ name: req.body.name }, { user: req.user._id });
    var note = new _note2.default(noteObject);
    note.save(function (err) {
      return res.json(note);
    });
  }
}

// Upserts the given Note in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _note2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Note in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _note2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Note from the DB
function destroy(req, res) {
  return _note2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=note.controller.js.map

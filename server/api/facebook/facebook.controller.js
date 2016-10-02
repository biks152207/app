/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/facebook              ->  index
 * POST    /api/facebook              ->  create
 * GET     /api/facebook/:id          ->  show
 * PUT     /api/facebook/:id          ->  upsert
 * PATCH   /api/facebook/:id          ->  patch
 * DELETE  /api/facebook/:id          ->  destroy
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

var _facebook = require('./facebook.model');

var _facebook2 = _interopRequireDefault(_facebook);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _user = require('../user/user.model');

var _user2 = _interopRequireDefault(_user);

var _auth = require('../../auth/auth.service');

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name'];
var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');

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

// Gets a list of Facebooks
function index(req, res) {
  return _facebook2.default.find().exec().then(respondWithResult(res)).catch(handleError(res));
}

// Gets a single Facebook from the DB
function show(req, res) {
  return _facebook2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(respondWithResult(res)).catch(handleError(res));
}

// Creates a new Facebook in the DB
function create(req, res) {
  var params = {
    code: req.body.code,
    client_id: _environment2.default.facebook.clientID,
    client_secret: _environment2.default.facebook.clientSecret,
    redirect_uri: req.body.redirectUri
  };
  _request2.default.get({ url: accessTokenUrl, qs: params, json: true }, function (err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }
    // Step 2. Retrieve profile information about the current user.
    _request2.default.get({ url: graphApiUrl, qs: accessToken, json: true }, function (err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      // Step 3. Create a new user account or return an existing one.
      _user2.default.findOne({ 'facebook.id': profile.id }, function (err, existingUser) {
        if (existingUser) {
          var token = (0, _auth.signToken)(existingUser._id, existingUser.role);
          return res.json({ token: token });
        }
        var user = new _user2.default({
          username: profile.first_name + ' ' + profile.last_name,
          email: profile.email,
          role: 'user',
          provider: 'facebook',
          facebook: {
            id: profile.id
          }
        });
        user.save(function () {
          var token = (0, _auth.signToken)(user._id, user.role);
          res.json({ token: token });
        });
      });
    });
  });
}

// Upserts the given Facebook in the DB at the specified ID
function upsert(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _facebook2.default.findOneAndUpdate({ _id: req.params.id }, req.body, { upsert: true, setDefaultsOnInsert: true, runValidators: true }).exec().then(respondWithResult(res)).catch(handleError(res));
}

// Updates an existing Facebook in the DB
function patch(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  return _facebook2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(patchUpdates(req.body)).then(respondWithResult(res)).catch(handleError(res));
}

// Deletes a Facebook from the DB
function destroy(req, res) {
  return _facebook2.default.findById(req.params.id).exec().then(handleEntityNotFound(res)).then(removeEntity(res)).catch(handleError(res));
}
//# sourceMappingURL=facebook.controller.js.map

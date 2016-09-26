'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.index = index;
exports.create = create;
exports.show = show;
exports.destroy = destroy;
exports.changePassword = changePassword;
exports.forget = forget;
exports.me = me;
exports.checkToken = checkToken;
exports.changepassword = changepassword;
exports.authCallback = authCallback;

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

var _environment = require('../../config/environment');

var _environment2 = _interopRequireDefault(_environment);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _utility = require('../../utilities/utility');

var _mailer = require('../../utilities/mailer');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var resetTemplate = {
  subject: 'Password Reset',
  text: 'You have subscribed newsletters'
};

function validationError(res, statusCode) {
  console.log('from error');
  statusCode = statusCode || 422;
  return function (err) {
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function (err) {
    return res.status(statusCode).send(err);
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 */
function index(req, res) {
  return _user2.default.find({}, '-salt -password').exec().then(function (users) {
    res.status(200).json(users);
  }).catch(handleError(res));
}

/**
 * Creates a new user
 */
function create(req, res) {
  var newUser = new _user2.default(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save().then(function (user) {
    var token = _jsonwebtoken2.default.sign({ _id: user._id }, _environment2.default.secrets.session, {
      expiresIn: 60 * 60 * 5
    });
    res.json({ token: token });
  }).catch(validationError(res));
}

/**
 * Get a single user
 */
function show(req, res, next) {
  var userId = req.params.id;

  return _user2.default.findById(userId).exec().then(function (user) {
    if (!user) {
      return res.status(404).end();
    }
    res.json(user.profile);
  }).catch(function (err) {
    return next(err);
  });
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
function destroy(req, res) {
  return _user2.default.findByIdAndRemove(req.params.id).exec().then(function () {
    res.status(204).end();
  }).catch(handleError(res));
}

/**
 * Change a users password
 */
function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return _user2.default.findById(userId).exec().then(function (user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      return user.save().then(function () {
        res.status(204).end();
      }).catch(validationError(res));
    } else {
      return res.status(403).end();
    }
  });
}

function forget(req, res) {
  var email = req.body.email;
  if (email) {
    return _user2.default.findOne({ email: email }).select('-password').exec().then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'We dont find the user with this email, Please try again with new email.' });
      }
      (0, _utility.generateToken)().then(function (token) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000;
        user.save().then(function () {
          resetTemplate.text = 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n\n                    Please click on the following link, or paste this into your browser to complete the process:\n\n\n                    http://' + req.headers.host + '/reset/' + token + '\n\n\n                    If you did not request this, please ignore this email and your password will remain unchanged.\n';
          (0, _mailer.sendMail)(_lodash2.default.merge(resetTemplate, { email: email })).then(function (result) {
            res.json({ message: 'We have sent you an email, Please check your email for registration.' });
          });
        }).catch(function (err) {
          console.log(err);
        });
      });
    });
  } else {
    return res.status(403).json({ message: 'Enter your email address' });
  }
}

/**
 * Get my info
 */
function me(req, res, next) {
  var userId = req.user._id;

  return _user2.default.findOne({ _id: userId }, '-salt -password').exec().then(function (user) {
    // don't ever give out the password or salt
    console.log(user);
    if (!user) {
      return res.status(401).end();
    }
    res.json(user);
  }).catch(function (err) {
    return next(err);
  });
}

function checkToken(req, res, next) {
  if (req.params.token) {
    return _user2.default.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }).exec().then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'Password reset token is invalid or has expired' });
      } else {
        return res.json({ message: 'success' });
      }
    });
  } else {
    return res.state(404).end();
  }
}

function changepassword(req, res, next) {
  console.log(req.body);
  if (req.body.token && req.body.password) {
    return _user2.default.findOne({ resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now() } }).exec().then(function (user) {
      if (!user) {
        return res.status(404).json({ message: 'Password reset token is invalid or has expired' });
      } else {
        console.log(user);
        user.password = req.body.password;
        user.resetPasswordToken = ' ';
        return user.save().then(function () {
          res.status(200).json({ message: 'Password successfully changed, Please login' });
        });
        // .catch(validationError(res));
      }
    });
  } else {
    return res.status(404).json({ message: 'Missing arguments' });
  }
}

/**
 * Authentication callback
 */
function authCallback(req, res) {
  res.redirect('/');
}
//# sourceMappingURL=user.controller.js.map

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sendMail = sendMail;

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _environment = require('../config/environment');

var _environment2 = _interopRequireDefault(_environment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transporter = _nodemailer2.default.createTransport({
    service: "SendGrid",
    auth: {
        user: _environment2.default.mailer.user, // Your email id
        pass: _environment2.default.mailer.password // Your password
    }
});

function sendMail(mailerObject) {

    var mailOptions = {
        from: _environment2.default.mailer.adminEmail, // sender address
        to: mailerObject.email, // list of receivers
        subject: mailerObject.subject,
        text: mailerObject.text

    };
    console.log('mailer');
    console.log(mailOptions);
    return _q2.default.promise(function (resolve, reject) {

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                console.log('from error onefsfsfsd');
                // reject();
            } else {
                console.log('from success');
                resolve({ message: 'Successful' });
            };
        });
    });
}
//# sourceMappingURL=mailer.js.map

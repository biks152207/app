'use strict';
/*eslint no-process-env:0*/

// Development specific configuration
// ==================================

module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/sc-dev'
  },
  mailer: {
    user: 'biks152207',
    password: 'shutterisland152207',
    adminEmail: 'bikrambasnet1@gmail.com'
  },
  facebook: {
    clientID: '1780990305515917',
    clientSecret: 'cc7341b671731df7efe44add63b1c79e',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  seedDB: true

};
//# sourceMappingURL=development.js.map

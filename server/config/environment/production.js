'use strict';
/*eslint no-process-env:0*/

// Production specific configuration
// =================================

module.exports = {
  // Server IP
  ip: process.env.OPENSHIFT_NODEJS_IP || process.env.ip || undefined,

  // Server port
  port: process.env.OPENSHIFT_NODEJS_PORT || process.env.PORT || 8080,

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI || process.env.MONGOHQ_URL || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME || 'mongodb://bikram:bikram@jello.modulusmongo.net:27017/bA9dibup'
  },
  facebook: {
    clientID: '1780990305515917',
    clientSecret: 'cc7341b671731df7efe44add63b1c79e',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  mailer: {
    user: 'biks152207',
    password: 'shutterisland152207',
    adminEmail: 'bikrambasnet1@gmail.com'
  }
};
//# sourceMappingURL=production.js.map

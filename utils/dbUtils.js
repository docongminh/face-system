const config = require('../config');
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useFindAndModify: false
};
const configs = require('../config');

if (configs.mongoodbConfig.ENV_MODE) {
  const fs = require('fs');
  const ca = fs.readFileSync(`${__dirname}/rds-combined-ca-bundle.pem`);
  options.sslValidate = true;
  options.sslCA = ca;
  options.ssl = true;
}

function connectDB(canConnectWhenError = true) {
  // console.log('Connect with: ' + config.domains.CONFIG_MONGO_URI);
  mongoose.connect(config.domains.CONFIG_MONGO_URI, options)
    .then(() => {
      console.log(`Connected database successfully: ${config.domains.CONFIG_MONGO_URI}`);
      mongoose.connection.on('disconnected', function (e) {
        setTimeout(function () {
          console.log('reconnect with mongodb');
          connectDB(false);
        }, 2000);
      });

    }, err => {
      console.log(`Error while connecting to database\n${err}`);
      if (canConnectWhenError) {
        setTimeout(function () {
          connectDB(true);
        }, 2000);
      }
    });
}

module.exports = {
  connectDB,
};

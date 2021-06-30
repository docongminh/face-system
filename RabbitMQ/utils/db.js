const config = require('../config');
const mongoose = require('mongoose');
const options = {
  useNewUrlParser: true,
  useFindAndModify: false
};

function connectDB(canConnectWhenError = true) {
  mongoose.connect(config.mongodb.CONFIG_MONGO_URI, options)
    .then(() => {
      console.log(`Connected database successfully: ${config.mongodb.CONFIG_MONGO_URI}`);
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

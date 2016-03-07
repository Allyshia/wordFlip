var mongoose = require('mongoose');
mongoose.Promise = require('bluebird'); // set Mongoose to use bluebird promises

var serviceConfig = require('../config/config').services;
var config = process.env.NODE_ENV == 'test' ? serviceConfig.test.mongo
    : process.env.NODE_ENV == 'development' ? serviceConfig.local.mongo
    : serviceConfig.production.mongo;

var util = require('util');
var Message = require('../models/message');

var url = 'mongodb://' + config.host + ':' + config.port + '/' + config.db;
var options = {};

module.exports.createConnection = function () {

    var db = mongoose.createConnection();
    db.on('error', function (error) {
        console.log('Mongoose connection error: ');
        console.log(util.inspect(error));
    });

    db.on('open', function () {
        console.log('Mongoose connection open!');
    });

    db.on('disconnected', function () {
        console.log('Mongoose connections closed.');
    });

    //options.server.socketOptions = options.replset.socketOptions = { keepAlive: 120 };

    //mongoose.connect(url, options).then(callback);
    //var db = mongoose.connection;

    db.open(url);

    return db;
};

module.exports.closeConnection = function (connection) {
    //return mongoose.disconnect();
    connection.close();
};
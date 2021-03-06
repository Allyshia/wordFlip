/**
 * Utilities around messages
 * Created by allyshia on 2016-03-05.
 */
var db = require('./db');
//var Message = require('../models/message');
var MessageSchema = require('../schemas/message.js');
var util = require('util');
var mongoose = require('mongoose');

module.exports.add = function (messageText, callback) {
    console.log('Adding message...');

    var connection = db.createConnection();
    var Message = connection.model('Message', MessageSchema);
    var m = new Message({ text: messageText });
    m.save(function (saveErr, message) {
        if (saveErr) {
            console.log('ERROR saving message: ' + util.inspect(saveErr));
            db.closeConnection(connection);
            callback(saveErr, null);
        }
        else {
            db.closeConnection(connection);
            callback(null, message);
        }
    });
};

module.exports.getAll = function (callback) {
    console.log('Getting all messages...');

    var connection = db.createConnection();
    var Message = connection.model('Message', MessageSchema);
    Message.find(function (error, messages) {
        if (error) {
            console.log('ERROR getting messages: ' + util.inspect((error)));
            db.closeConnection(connection);
            callback(error, null);
        }
        else {
            db.closeConnection(connection);
            callback(null, messages);
        }
    });
};

module.exports.get = function (messageId, callback) {
    console.log('Getting message: ' + messageId);

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        callback(null, null);
    }
    else {
        var connection = db.createConnection();
        var Message = connection.model('Message', MessageSchema);
        Message.findById(messageId, function (error, message) {
            if (error) {
                console.log('ERROR getting message: ' + util.inspect((error)));
                db.closeConnection(connection);
                callback(error, null);
            }
            else {
                db.closeConnection(connection);
                callback(null, message);
            }
        });
    }
};

module.exports.update = function (messageId, params, callback) {
    console.log('Updating message: ' + messageId + ' with params ' + util.inspect(params));

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        callback(null, null);
    }
    else {
        var connection = db.createConnection();
        var Message = connection.model('Message', MessageSchema);
        var options = {};
        Message.findByIdAndUpdate(messageId, params, options, function (error, message) {
            if (error) {
                console.log('ERROR updating message: ' + util.inspect((error)));
                db.closeConnection(connection);
                callback(error, null);
            }
            else {
                db.closeConnection(connection);
                callback(null, message);
            }
        });
    }
};

module.exports.remove = function (messageId, callback) {
    console.log('Removing message: ' + messageId);

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
        callback(null, null);
    }
    else {
        var connection = db.createConnection();
        var Message = connection.model('Message', MessageSchema);
        var options = {};
        Message.findByIdAndRemove(messageId, options, function (error, message) {
            if (error) {
                console.log('ERROR removing message: ' + util.inspect((error)));
                db.closeConnection(connection);
                callback(error, null);
            }
            else {
                db.closeConnection(connection);
                callback(null, message);
            }
        });
    }
};
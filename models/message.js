/**
 * Message Mongoose model
 * Created by allyshia on 2016-03-05.
 */
var mongoose = require('mongoose');
var schema = require('../schemas/message');

var Message = mongoose.model('Message', schema);

Message.mapResponse = function (m) {
    return { id: m._id, text: m.text };
};

module.exports = Message;
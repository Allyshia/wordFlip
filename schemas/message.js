/**
 * Message Mongoose schema
 * Created by allyshia on 2016-03-05.
 */
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: String
});

module.exports = messageSchema;
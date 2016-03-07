/**
 * Message Mongoose schema
 * Created by allyshia on 2016-03-05.
 */
var mongoose = require('mongoose');

var messageSchema = mongoose.Schema({
    text: String
});

messageSchema.methods.isPalindrome = function () {
    return this.text === _reverse(this.text);
};

function _reverse(s) {
    return s.split('').reverse().join('');
}

module.exports = messageSchema;
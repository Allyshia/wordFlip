/**
 * Created by allyshia on 2016-03-06.
 */
var messageUtil = require('../util/message-crud');

var QUERY_IS_PALINDROME = 'isPalindrome';
var _validQueries = [QUERY_IS_PALINDROME];

module.exports.validateQueries = function (queries) {
    var isValid = true;
    for (var i in queries) {
        // Stop as soon as we hit bad input
        if (_validQueries.indexOf(queries[i]) === -1) {
            // Stop as soon as we hit bad input
            isValid = false;
            break;
        }
    }
    return isValid;
};

module.exports.processQueries = function (message, queries, callback) {
    var queryResult = {};
    for (var i = 0; i < queries.length; i++) {
        if (queries[i] === QUERY_IS_PALINDROME) {
            queryResult.isPalindrome = message.isPalindrome();
        }
    }
    callback(null, queryResult);
};
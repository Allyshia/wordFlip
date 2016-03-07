var express = require('express');
var util = require('util');
var _ = require('lodash');
var messageUtil = require('../util/message-crud');
var messageQueriesUtil = require('../util/message-queries');
var Message = require('../models/message');

var router = express.Router();

router.post('/', function (req, res, next) {
    var text = req.body.text;

    if (!text) {
        res.status(400).json({ error: 'You must provide non-empty message text.' });
    }
    else {
        messageUtil.add(text, function (error, message) {
            if (error) {
                res.status(500).json({ error: 'Could not create message: ' + util.inspect(error) });
            }
            else {
                res.status(201).json(
                    {
                        message: Message.mapResponse(message)
                    }
                );
            }
        });
    }
});

router.get('/', function (req, res, next) {
    messageUtil.getAll(function (error, messages) {
        if (error) {
            res.status(500).json({ error: 'Could not get messages: ' + util.inspect(error) });
        }
        else {
            res.status(200).json(
                {
                    messages: _.map(messages, Message.mapResponse)
                }
            );
        }
    });
});

router.get('/:id', function (req, res, next) {
    messageUtil.get(req.params.id, function (error, message) {
        if (error) {
            res.status(500).json({ error: 'Could not get message: ' + util.inspect(error) });
        }
        else if (!message) {
            res.sendStatus(404);
        }
        else {
            res.status(200).json({ message: Message.mapResponse(message) });
        }
    });
});

router.put('/:id', function (req, res, next) {
    if (!req.body || !req.body.text) {
        res.status(400).json({ error: 'You must provide message text to be updated.' }); //  TODO reconsider this validation
    }
    else {
        messageUtil.update(req.params.id, { text: req.body.text }, function (error, message) {
            if (error) {
                res.status(500).json({ error: 'Could not get message: ' + util.inspect(error) });
            }
            else if (!message) {
                res.sendStatus(404);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
});

router.delete('/:id', function (req, res, next) {
    messageUtil.remove(req.params.id, function (error, message) {
        if (error) {
            res.status(500).json({ error: 'Could not remove message: ' + util.inspect(error) });
        }
        else if (!message) {
            res.sendStatus(404);
        }
        else {
            res.sendStatus(200);
        }
    });
});

router.get('/:id/query', function (req, res, next) {
    messageUtil.get(req.params.id, function (error, message) {
        if (error) {
            res.status(500).json({ error: 'Could not get message: ' + util.inspect(error) });
        }
        else if (!message) {
            res.sendStatus(404);
        }
        else {
            var queryParams = req.query.params;
            if (queryParams) {
                var queries = queryParams.split(',');
                if (queries) {
                    var areQueriesValid = messageQueriesUtil.validateQueries(queries);
                    if (!areQueriesValid) {
                        res.status(400).json({ error: 'You must specify a comma-separated list of valid queries. Valid values are: isPalindrome: ' });
                    }
                    else {
                        messageQueriesUtil.processQueries(message, queries, function (error, queryResult) {
                            if (error) {
                                res.status(500).json({ error: 'Error processing queries: ' + util.inspect(error) });
                            }
                            else {
                                res.status(200).json({ queryResult: queryResult });
                            }
                        });
                    }
                }
            }
        }
    });
});

module.exports = router;
var express = require('express');
var util = require('util');
var _ = require('lodash');
var messageUtil = require('../util/message');
var Message = require('../models/message');

var router = express.Router();

router.post('/', function (req, res, next) {
    var text = req.body.text;

    if (!text) {
        res.status(400).json({ error: 'You must provide message text.' });
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
            res.status(500).send('Could not get message: ' + util.inspect(error));
        }
        else {
            res.status(200).json(
                {
                    message: Message.mapResponse(message)
                }
            );
        }
    });
});

router.put('/:id', function (req, res, next) {
    if (!req.body || req.body.text === undefined || req.body.text === null) {
        res.status(404).json({ error: 'You must provide message text to be updated.' }); //  TODO reconsider this validation
    }
    else {
        messageUtil.update(req.params.id, { text: req.body.text }, function (error, message) {
            if (error) {
                res.status(500).json({ error: 'Could not get message: ' + util.inspect(error) });
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
        else {
            res.sendStatus(200);
        }
    });
});

// --- TEST GET ---
router.get('/test', function (req, res, next) {
    res.send('This is a test!');
});

module.exports = router;
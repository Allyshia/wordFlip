var express = require('express');
var router = express.Router();

/* GET messages */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST a message */
router.post('/', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
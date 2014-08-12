var express = require('express');
var db = require('../models');
var router = express.Router();

/* GET home page. */
router.get('/index', function(req, res) {
  res.render('fastv.html', { title: 'Express' });
});

module.exports = router;
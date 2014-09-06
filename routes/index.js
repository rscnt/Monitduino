var express = require('express');
var db = require('../models');
var router = express.Router();

/* GET home page
router.get('/', function(req, res) {
  res.render('base.html', { title: 'Express' });
});
*/

/* GET home page. */
router.get('/', function(req, res) {
  res.render('fastv.html', { title: 'Express' });
});

module.exports = router;

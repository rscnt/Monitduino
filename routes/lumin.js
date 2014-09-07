var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on c lumin request");
    resp.render('lumin.html', {title: 'Control Luminaria'});
});

module.exports = router;
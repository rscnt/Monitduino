var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on smoke request");
    resp.render('humo.html', {title: 'Humo'});
});

module.exports = router;
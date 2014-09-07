var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on camara request");
    resp.render('cam.html', {title: 'Vista camara'});
});

module.exports = router;
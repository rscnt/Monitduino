var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on c air request");
    resp.render('temair.html', {title: 'Control Temperatura'});
});

module.exports = router;
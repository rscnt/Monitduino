var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on state door request");
    resp.render('puertastate.html', {title: 'Estado Puerta'});
});

module.exports = router;
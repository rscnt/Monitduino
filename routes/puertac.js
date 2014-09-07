var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on acces registry request");
    resp.render('puertaacceso.html', {title: 'Acceso Puerta'});
});

module.exports = router;
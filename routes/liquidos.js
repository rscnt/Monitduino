var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on liquids request");
    resp.render('liquid.html', {title: 'Liquidos'});
});

module.exports = router;

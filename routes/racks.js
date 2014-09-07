/** Racks: Puertas y temperatura. */
var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on racks request");
    resp.render('racks.html', {title: 'Racks'});
});

module.exports = router;

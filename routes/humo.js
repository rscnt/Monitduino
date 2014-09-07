var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('humo.html', {title: 'Humo'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "humo"}}
    }).success(function(nodeRegistrations){
	resp.json({name: "humo", items: nodeRegistrations});
    });    
});


module.exports = router;

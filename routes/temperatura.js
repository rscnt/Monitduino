var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('temperatura.html', {title: 'Temperatura'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "temperatura"}}
    }).success(function(nodeRegistrations){
	resp.json({name: "temperatura", items: nodeRegistrations});
    });    
});

module.exports = router;

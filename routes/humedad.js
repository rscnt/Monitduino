var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('humedad.html', {title: 'Humedad'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "humedad"}}, order: [['date', 'DESC']]
    }).success(function(nodeRegistrations){
	resp.json({name: "humedad", items: nodeRegistrations});
    });    
});

module.exports = router;

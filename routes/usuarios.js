var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('temperatura.html', {title: 'Temperatura'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: ["name = ? AND value < 11", "usuario"],
	order: '`date` DESC'
    }).success(function(nodeRegistrations){
	resp.json({name: "usuarios", items: nodeRegistrations});
    });    
});

module.exports = router;

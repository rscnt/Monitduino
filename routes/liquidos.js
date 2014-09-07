var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('liquid.html', {title: 'Liquidos'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "liquido"}}
    }).success(function(nodeRegistrations){
	resp.json({items: nodeRegistrations});
    });    
});

module.exports = router;

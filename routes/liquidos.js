var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('liquid.html', {title: 'Liquidos'});
});

router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "liquido%"}},
	order: '`date` DESC'
    }).success(function(nodeRegistrations){
	resp.json({name: "liquidos", items: nodeRegistrations});
    });    
});

module.exports = router;

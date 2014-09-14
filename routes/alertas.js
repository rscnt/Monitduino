var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('alertas.html', {title: 'Alertas'});
});

router.get("/data", function(req, resp) {
    db.Alert.findAll().success(function(nodeRegistrations){
	resp.json({name: "alertas", items: nodeRegistrations});
    });    
});

module.exports = router;

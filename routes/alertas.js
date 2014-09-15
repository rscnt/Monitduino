var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('alertas.html', {title: 'Alertas'});
});

router.get("/data", function(req, resp) {
    var predicate = false;
    db.Alert.findAll({include: [{model: db.Registry, require: true}]}).success(function(nodeRegistrations){
	resp.json({name: "alertas", items: nodeRegistrations});
    });
});

module.exports = router;









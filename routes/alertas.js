var express = require('express');
var Storage = require('../monitduino/storage');
var monitduino = require("../monitduino/jfive");
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    resp.render('alertas.html', {title: 'Alertas'});
});


router.get("/data", function(req, resp) {
    var predicate = false;
    db.Alert.findAll(
	{
	    include: [{model: db.Registry, require: true}],
	    order: '`date` DESC'
	}
    ).success(function(nodeRegistrations){
	resp.json({name: "alertas", items: nodeRegistrations});
    });
});

router.get("/alarma", function(req, resp) {
    resp.json({alarma: monitduino.globals.alarms });
});

module.exports = router;









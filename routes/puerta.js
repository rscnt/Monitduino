var express = require('express');
var Storage = require('../monitduino/storage');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, resp){
    console.log("on state door request");
    resp.render('puertastate.html', {title: 'Estado Puerta'});
});


router.get("/data", function(req, resp) {
    db.Registry.findAll({
        where: {name: {like: "puerta"}},
	order: '`date` DESC'
    }).success(function(nodeRegistrations){
	resp.json({name: "puerta", items: nodeRegistrations});
    });    
});


module.exports = router;

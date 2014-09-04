var express = require('express');
var Storage = require('../monitduino/storage');
var storage = new Storage();
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with all user');
});

router.get('/new', function(req, res) {
  res.render("userNewTemplate.html", {title: "Crear nuevo usuario"});
});

router.post('/me', function(req, res) {
    var name = req.body.name,
	lastname = req.body.lastname,
	password = req.body.password;
    storage.createUser(name, password, 'administrator', '', null);
});

router.get('/me', function(req, res) {

});


router.get('/users/:id', function(req, res) {
  res.send('sees a user with an id');
});

module.exports = router;

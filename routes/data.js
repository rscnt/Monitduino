var express = require('express');
var Storage = require('../monitduino/storage');
var storage = new Storage();
var router = express.Router();

router.param('data_name', function(req, res, next, data_name) {
	storage.findDataByName(data_name, function(err, data){
		req.data = data;
		next();
	});
});



router.route('/:data_name')
.all(function(req, res, next) {
	console.log(req.data)
	next();
})
.get(function(req, res, next) {
  res.render('base.html');
})
.put(function(req, res, next) {
  // just an example of maybe updating thedata
  req.data.name = req.params.name;
  // save user ... etc
  //res.render('base.html');
})
.post(function(req, res, next) {
  next(new Error('not implemented'));
})
.delete(function(req, res, next) {
  next(new Error('not implemented'));
})

module.exports = router;
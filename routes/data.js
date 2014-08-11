var express = require('express');
var storage = require('../monitduino/storage');
var router = express.Router();

/* GET home page. */
router.param('data', function(req, res, next, data){
	storage.findDataByName(id, function(err, data){
		if (!!data) {
			return next(new Error('failed to load user'));
		}
		req.data = data;
		next();
	});
});

router.get('/data/:data', function(req, res, next) {
	console.log(req.data);
	console.log(next);
	res.send('temp.html', {data: req.data});
});

module.exports = router;
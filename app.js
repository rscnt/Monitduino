var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');

var routes = require('./routes/index');
var users = require('./routes/users');
//var data = require('./routes/data');
// Sensor principal de liquidos.
var routesLiquid = require('./routes/liquidos');
//Sensor de humo principal.
var routesHumo = require('./routes/humo');
//Sensor principal de temepratura.
var routesTemperatura = require("./routes/temperatura");
var routesHumedad = require("./routes/humedad");
//TODO: Puerta B
var estadoruta = require('./routes/puerta');
//TODO: Puerta C
var accesoruta = require('./routes/puertac');
//TODO: Racks.
var rack = require('./routes/racks');
//TODO: Luminaria.
var luzc = require('./routes/lumin');
//TODO: Temperatura.
var aircon = require('./routes/tempt');
//TODO: Camara.
var cam = require('./routes/cam');
//var index = require('./routes/general');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var Monitduino = require('./monitduino/jfive');
var monitduino = new Monitduino();
var db = require('./models/index.js');
var Storage = require('./monitduino/storage');

//nunjucks configuration
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/usuarios', users);
app.use('/liquidos', routesLiquid);
//app.use('/datos', data);
app.use("/temperatura", routesTemperatura);
app.use("/humedad", routesHumedad);
app.use('/humo', routesHumo);
app.use('/estpuerta', estadoruta);
app.use('/accpuerta', accesoruta);
app.use('/rack', rack);
app.use('/lumina', luzc);
app.use('/airc', aircon);
app.use('/camara', cam);

// app.use('/', index);
/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// squalize

app.set('port', process.env.PORT || 3000);

var debug = require('debug')('monitduino');

monitduino.setupSerialPort();
monitduino.setupBoard();

db
.sequelize
.sync({ force: true })
.complete(function(err) {
    if (err) {
        throw err[0];
    } else {
        var server = http.listen(app.get('port'), function() {
            debug('Express server listening on port ' + server.address().port);
	    monitduino.initStorage();
            io.on('connection', function(socket) {
		monitduino.setSocket(socket);
            });
        });
    }
});

//module.exports = app;

var Storage = new require("./storage"),
    storage = new Storage();
var socketIO;
var five = require("johnny-five"),
	board,button,sensor,
    com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	parser: com.parsers.readline('\r\n')
});
var time = 0;
var l_a = 0;
var l_b = 0;
var h = 0;


var counterLiquidsA = 0;
var counterLiquidsB = 0;
var counterTemperature = 0;
var counterHumidity = 0;
var counterSmog = 0;

function sendSocketAndMaybeStoreRegistry(name, value, counter, store) {
    var registry = {name: name, value: value};
    console.log("NAME : " + name + " Value: " + value + " Store: " + store +  " Counter: " + counter);
    if (counter >= 10 || store) {
	storage.createRegistry(registry.name, registry.value);
	counter = 0;
    }
    counter = counter + 1; 
    if (socketIO) {
	console.log(registry);
	socketIO.emit('general', registry);    
    }
    return registry;
 }


var init = function(io) {
    socketIO = io;
    board = new five.Board();

	board.on("ready", function(){

	var led = new five.Led(13);

	var liq_a = new five.Button({
		board: board,
		pin: 2,
		holdtime: 3000,
		invert: true
	});

	var liq_b = new five.Button({
		board: board,
		pin: 3,
		holdtime: 3000,
		invert: false
	});

	var hum_a = new five.Button({
		board: board,
		pin: 4,
		holdtime: 3000,
		invert: false
	});

	var t_rack = new five.Sensor({
		pin: "A0",
		freq: 30000
	});

// development

<<<<<<< HEAD
liq_a.on('hold', function(data){
	//console.log("Acces");
	l_a = "1";
	var object  = {
            Liquido: l_a,
        };
	storage.createRegistry(
		Storage.data.Liquido,
		object.Liquido
		);
	//console.log(l_a);
	return object;
=======
 liq_a.on('hold', function(data){
     l_a = "1";
    var registry = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, l_a, counterLiquidsA, true);
    console.log(l_a);
    return registry;
>>>>>>> 6cfc4426376aa29f80cfef14eac203d62c83227d
});


liq_a.on('up', function(data){
<<<<<<< HEAD
	//console.log("Acces");
	l_a = "0";
	var object  = {
            Liquido: l_a,
        };
	storage.createRegistry(
		Storage.data.Liquido,
		object.Liquido
		);
	//console.log(l_a);
	return object;
=======
    console.log("Acceso en liquidos A");
    l_a = "0";
    var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, l_a, counterLiquidsA, false);
    return object;
>>>>>>> 6cfc4426376aa29f80cfef14eac203d62c83227d
});

liq_b.on('hold', function(data){
    l_b = "1";
    var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, l_b, counterLiquidsB, true);
    return object;
});

liq_b.on('up', function(data){
    l_b = "0";
    var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, l_b, counterLiquidsB, false);
    return object;
});

hum_a.on('hold', function(data){
    h = "1";
    var object = sendSocketAndMaybeStoreRegistry(Storage.data.Humo, h, counterSmog, true);
    return object;
});

hum_a.on('up', function(data){
	h = "0";
    var object = sendSocketAndMaybeStoreRegistry(Storage.data.Humo, h, counterSmog, false);
    return object;
});

t_rack.on('data', function(){
    var  tr = (5 * this.value * 100) / 1024;
    var  tro = tr.toFixed(2);
});


// object
this.repl.inject({
	liq_a: liq_a, 
	liq_b: liq_b,
	hum_a: hum_a,
	t_rack: t_rack,
	led: led
});
});
};

/* 
 * initS : 
 * A callback is supposed to be passed, when is opened, we do something. 
 */
var initS = function(callback) { 
    serialPort.on('open',function() {
        if (typeof callback === "function") {
            callback.call();
        }
    });
};

/* 
 * dataS : 
 * Accepts a function that reacts each time some data is collected. 
 * The function should receive as parameter an object, that object
 * has the following schema:
 *  {Celsius: 1, Humedad: 2}
 */
var dataS = function() {

    serialPort.on('data', function(data) {
    	time++;
        //recolecta info del puerto serial
        var info = data; 
        console.log(info);					
        //divide la informacion (Hum, Temp)
        var ext = info.split(","); 			
        //recoge la temperatura
        var celsius = parseFloat(ext[1]); 	
        //recoge la humedad.
        var hum_ = parseFloat(ext[0]);
        // result object
        var object  = {
            Celsius: celsius,
            Humedad: hum_
        };
        if(time === 2){
	    var alertForTemperature = (object.Celsius >= Storage.schemas.Temperatura.schema.max);
	    var alertForHumidity = (object.Humedad >= Storage.schemas.Humedad.schema.max);
	    sendSocketAndMaybeStoreRegistry(Storage.data.Celsius, object.Celsius, counterTemperature, alertForTemperature ? true : false);
	    sendSocketAndMaybeStoreRegistry(Storage.data.Humedad, object.Humedad, counterHumidity, alertForHumidity ? true : false);
            time = 0;
        }
        
        return object;	
    });
};
/*
init();
initS();
dataS();
*/

module.exports.init = init;
module.exports.initS = initS;
module.exports.dataS = dataS;

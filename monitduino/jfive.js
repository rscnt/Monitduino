var Storage = new require("./storage"),
    storage = new Storage();
var socketIO;
var five = require("johnny-five"),
    board = five.Board(),
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
    if (counter >= 30 || store) {
	storage.createRegistry(registry.name, registry.value);
	counter = 0;
    }
    counter++; 
    if (socketIO) {
	socketIO.emit('general', registry);    
    }
    return registry;
}

var setSocket = function(io){
    socketIO = io;
};

var liq_a, liq_b, liq_c, hum_a, t_rack;
var negativeValue = "0", positiveValue = "1";

board.on("ready", function(){

    liq_a = new five.Button({
	board: board,
	pin: 22,
	holdtime: 3000,
	invert: false
    });

    liq_b = new five.Button({
	board: board,
	pin: 23,
	holdtime: 3000,
	invert: false
    });

    hum_a = new five.Button({
	board: board,
	pin: 24,
	holdtime: 3000,
	invert: false
    });

    t_rack = new five.Sensor({
	pin: "A0",
	freq: 30000
    });

    // development

    liq_a.on('hold', function(data){
	var registry = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, positiveValue, counterLiquidsA, true);
	return registry;
    });


    liq_a.on('up', function(data){
	var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, negativeValue, counterLiquidsA, false);
	return object;
    });

    liq_b.on('hold', function(data){
	var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, positiveValue, counterLiquidsB, true);
	return object;
    });

    liq_b.on('up', function(data){
	var object = sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, negativeValue, counterLiquidsB, false);
	return object;
    });

    hum_a.on('hold', function(data){
	var object = sendSocketAndMaybeStoreRegistry(Storage.data.Humo, positiveValue, counterSmog, true);
	return object;
    });

    hum_a.on('up', function(data){
	var object = sendSocketAndMaybeStoreRegistry(Storage.data.Humo, negativeValue, counterSmog, false);
	return object;
    });

    t_rack.on('data', function() {
	/*
	var  tr = (5 * this.value * 100) / 1024;
	var  tro = tr.toFixed(2);
	 */
    });

});

/* 
 * initS : 
 * A callback is supposed to be passed, when is opened, we do something. 
 */
serialPort.on('open',function() {});

/* 
 * dataS : 
 * Accepts a function that reacts each time some data is collected. 
 * The function should receive as parameter an object, that object
 * has the following schema:
 *  {Celsius: 1, Humedad: 2}
 */

serialPort.on('data', function(data) {
    time++;
    //recolecta info del puerto serial
    var info = data; 					
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
    if(time === 5){
	var alertForTemperature = (object.Celsius >= Storage.schemas.Temperatura.schema.max);
	var alertForHumidity = (object.Humedad >= Storage.schemas.Humedad.schema.max);
	sendSocketAndMaybeStoreRegistry(Storage.data.Celsius, object.Celsius, counterTemperature, alertForTemperature ? true : false);
	sendSocketAndMaybeStoreRegistry(Storage.data.Humedad, object.Humedad, counterHumidity, alertForHumidity ? true : false);
        time = 0;
    }
    return object;	
});

module.exports.setSocket = setSocket;

var Storage = new require("./storage"),
    storage = new Storage();
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

var init = function() {
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
});


liq_a.on('up', function(data){
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
});

liq_b.on('hold', function(data){
	l_b = "1";
});

liq_b.on('up', function(data){
	l_b = "0";
});

hum_a.on('hold', function(data){
	h = "1";
	var object  = {
            Humo: h,
        };
	storage.createRegistry(
		Storage.data.Humo,
		object.Humo
		);
	return object;
});

hum_a.on('up', function(data){
	h = "0";
	var object  = {
            Humo: h,
        };
	storage.createRegistry(
		Storage.data.Humo,
		object.Humo
		);
	return object;
});

t_rack.on('data', function(){
	tr = (5 * this.value * 100) / 1024;
	tro = tr.toFixed(2);
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
        storage.createRegistry(
            Storage.data.Celsius,
            object.Celsius
        );
        storage.createRegistry(
            Storage.data.Humedad,
            object.Humedad
        );
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

var Storage = new require("./storage"),
    storage = new Storage();
var five = require("johnny-five"),
	board,button,sensor,
    com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	parser: com.parsers.readline('\r\n')
});


board = new five.Board();

var init = function() {board.on("ready", function(){

		var liq_a = new five.Button({
			board: board,
			pin: 22,
			holdtime: 3000,
			invert: false
		});

		var liq_b = new five.Button({
			board: board,
			pin: 23,
			holdtime: 3000,
			invert: false
		});

		var hum_a = new five.Button({
			board: board,
			pin: 24,
			holdtime: 3000,
			invert: false
		});

		var t_rack = new five.Sensor({
			pin: "A0",
			freq: 3000
		});

// development
	
			liq_a.on('hold', function(data){
				var l_a = "1";
                return l_a;
			});
				

			liq_a.on('up', function(data){
				var l_a = "0";
                return l_a;
			});

	

		liq_b.on('hold', function(data){
			var l_b = "1";
		});

		liq_b.on('up', function(data){
			var l_b = "0";
		});

		hum_a.on('hold', function(data){
			var h = "1";
        });

		hum_a.on('up', function(data){
			var h = "0" 
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
	t_rack: t_rack
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
        storage.createRegistry(
            Storage.data.Celsius,
            object.Celsius
        );
        storage.createRegistry(
            Storage.data.Humedad,
            object.Humedad
        );
        return object;	

    });
};


module.exports.init = init;
module.exports.initS = initS;
module.exports.dataS = dataS;

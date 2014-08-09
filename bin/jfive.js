var five = require("johnny-five"),
	board,button,sensor;
var com = require("serialport");

var serialPort = new com.SerialPort("/dev/ttyUSB0", {
	baudrate: 9600,
	parser: com.parsers.readline('\r\n')
});

board = new five.Board();

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
		freq: 3000
	});

// development

	liq_a.on('hold', function(data){
		var l_a = "1"
		io.emit('liq_a', l_a);
		console.log("1");
	});

	liq_a.on('up', function(data){
		var l_a = "0"
		io.emit('liq_a', l_a);
		console.log("0");
	});

	liq_b.on('hold', function(data){
		var l_b = "1"
		io.emit('liq_b', l_b);
		console.log("1");
	});

	liq_b.on('up', function(data){
		var l_b = "0"
		io.emit('liq_b', l_b);
		console.log("0");
	});

	hum_a.on('hold', function(data){
		var h = "1"
		io.emit('hum_', h); 
		console.log("1");
	});

	hum_a.on('up', function(data){
		var h = "0"
		io.emit('hum_', h); 
		console.log("0");
	});

	t_rack.on('data', function(){
		tr = (5 * this.value * 100) / 1024;
		tro = tr.toFixed(2);
		io.emit('t_rack', tro);
		console.log(tro);
	});

// object

	this.repl.inject({
		liq_a: liq_a, 
		liq_b: liq_b,
		hum_a: hum_a,
		t_rack: t_rack
		})
});

serialPort.on('open',function() {
  console.log('Port open');
});

serialPort.on('data', function(data) {
	var info = data; 					//recolecta info del puerto serial
	var ext = info.split(","); 			// divide la informacion (Hum, Temp)
	var celsius = parseFloat(ext[1]); 	//recoge la temperatura
	var hum_ = parseInt(ext[0]);		//recoge la humedad.
	io.emit('t_gen', celsius);
	io.emit('h_gen', hum_);
	console.log(celsius);
	console.log(hum_);
});
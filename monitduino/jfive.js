var Storage = new require("./storage"),
    storage = new Storage();
var redis = new require("redis"),
    client = redis.createClient();
var socketIO;
var five = require("johnny-five"),
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
var datoT = new Array;
var datoH = new Array;

var Monitduino = function(){
    var that = this;
    this.socketIO = null;
    this.nNotifications = null;
    this.liq_a = null;
    this.liq_b = null;
    this.liq_c = null;
    this.hum_a = null;
    this.t_track = null;
    this.board = null;
    this.count = 0;
    this.humos = 0;
    this.alarma = null;
    this.luz1 = null;
    this.luz2 = null;
    this.aire1 = null;
    this.aire2 = null;
    this.aires1 = 0;
    this.aires2 = 0;
    this.luces1 = 0;
    this.luces2 = 0;
    this.airesC = 0;
    this.airesC2 = 0;
    client.get("numberOfAlerts", function(err, reply) {
	if (err) { console.log(err); }
	if (reply !== undefined && reply !== null) {
	    that.nNotifications = reply;
	} else {
	    that.nNotifications = 0;
	}
    });
};

Monitduino.prototype.sendSocketAndMaybeStoreRegistry = function(name, value, counter, store) {
    var registry = {name: name, value: value};
    if (storage !== undefined && storage !== null) {
	storage.createRegistry(registry.name, registry.value);	
    } else { console.log("storage not defined"); }
    this.count = 0;
    if (this.socketIO !== undefined && this.socketIO !== null) {
   	switch(registry.name) {
   	case "Temperatura":
   	case "temperatura":
   	    datoT.push([registry.value]);
	    if (registry.value >= Storage.schemas.Temperatura.schema.max) {
		this.socketIO.emit('alert', {name: "temperatura alta.", value: registry.value});
	    }
	    this.socketIO.emit('promt', datoT);
	    break;
	case "Humedad":
   	case "humedad":
    	    datoH.push([registry.value]);
	    if (registry.value) {
		this.socketIO.emit('alert', {name: "Se ha detectado humedad en la sala.", value: registry.value});
	    }
	    this.socketIO.emit('humt', datoH);
	    break;
	case "liquidoA":
	case "LiquidoA":
	    if (registry.value) {
	    	this.socketIO.emit('alert', {name: "Se ha detectado liquido en sala A.", value: registry.value});
	    }
	    break;
	case "liquidoB":
	case "LiquidoB":
	    if (registry.value) {
	    	this.socketIO.emit('alert', {name: "Se ha detectado liquido en sala B.", value: registry.value});
	    }
	    break;
	case "liquidoC":
	case "LiquidoC":
	    if (registry.value >= Storage.schemas.LiquidoC.schema.max) {
	    	this.socketIO.emit('alert', {name: "Se ha detectado liquido en sala C.", value: registry.value});
	    }
	    break;
	case "humo":
	case "humo":
	    if (registry.value) {
	    	this.socketIO.emit('alert', {name: "Se ha detectado humo en la sala.", value: registry.value});
	    }
	    break;
	};   
	
	this.socketIO.emit('general', registry);    
    } else {
    }
    return registry;
};

Monitduino.prototype.initStorage = function() {
    storage.init();
};

Monitduino.prototype.setSocket = function(io) {
    this.socketIO = io;
    this.setupSocketEvents();
};

Monitduino.prototype.setupSocketEvents = function(){
	var that = this;

    this.socketIO.on('humo', function(data) {
	that.humos = data;
	that.activatedesalarm(data);
    });

    this.socketIO.on('luz1', function(data){
	that.luces1 = data;
	that.activarluz1(data);
    });

    this.socketIO.on('luz2', function(data){
	that.luces2 = data;
	that.activarluz2(data);
    });

    this.socketIO.on('air1', function(data){
	that.aires1 = data;
	that.activaraire1(data);
    });

    this.socketIO.on('air2', function(data){
	that.aires2 = data;
	that.activaraire2(data);
    });

    this.socketIO.on('a1control', function(data){
	that.airesC = data;
	that.controlaire1(data);
    });

    this.socketIO.on('a2control', function(data){
	that.airesC2 = data;
	that.controlaire2(data);
    });

};

Monitduino.prototype.activarluz1 = function(activate){
	var result = false;
	if(this.luz1 !== null && this.luz1 !== undefined){
		activate ? this.luz1.on() : this.luz1.off();
		result = true;
	}
	return result = true;
}

Monitduino.prototype.activarluz2 = function(activate){
	var result = false;
	if(this.luz2 !== null && this.luz2 !== undefined){
		activate ? this.luz2.on() : this.luz2.off();
		result = true;
	}
	return result = true;
}

Monitduino.prototype.activaraire1 = function(activate){
	var result = false;
	if(this.aire1 !== null && this.aire1 !== undefined){
		activate ? this.aire1.on() : this.aire1.off();
		result = true;
	}
	return result = true;
}

Monitduino.prototype.activaraire2 = function(activate){
	var result = false;
	if(this.aire2 !== null && this.aire2 !== undefined){
		activate ? this.aire2.on() : this.aire2.off();
		result = true;
	}
	return result = true;
}

Monitduino.prototype.controlaire1 = function(control){
	var result = false;
	if(this.aire1 !== null && this.aire1 !== undefined){
		if (control == 1){
			this.aire1.brightness(64);
		}
		if (control == 2){
			this.aire1.brightness(128);
		}
		if (control == 3){
			this.aire1.brightness(190);
		}
		if (control == 4){
			this.aire1.brightness(255);
		}
	}
	return result = true;
}

Monitduino.prototype.controlaire2 = function(control){
	var result = false;
	if(this.aire2 !== null && this.aire2 !== undefined){
		if (control == 1){
			this.aire2.brightness(64);
		}
		if (control == 2){
			this.aire2.brightness(128);
		}
		if (control == 3){
			this.aire2.brightness(190);
		}
		if (control == 4){
			this.aire2.brightness(255);
		}
	}
	return result = true;
}

Monitduino.prototype.activatedesalarm = function(activate){
	var result = false;
	if(this.alarma !== null && this.alarma !== undefined) {
		activate ? this.alarma.on() : this.alarma.off();
		result = true;
	}
	return result = true;
};

var negativeValue = "0", positiveValue = "1";

Monitduino.prototype.setupBoard = function ()  {

    var that = this;
    that.board = five.Board();
    if (that.board) {
	that.board.on("ready", function(){

	    that.liq_a = new five.Button({
		board: that.board,
		pin: 22,
		holdtime: 3000,
		invert: false
	    });

	    that.liq_b = new five.Button({
		board: that.board,
		pin: 23,
		holdtime: 3000,
		invert: false
	    });

	    that.liq_b = new five.Button({
		board: that.board,
		pin: 24,
		holdtime: 3000,
		invert: false
	    });

	    that.hum_a = new five.Button({
		board: that.board,
		pin: 25,
		holdtime: 3000,
		invert: false
	    });

	    that.t_rack = new five.Sensor({
		pin: "A0",
		freq: 30000
	    });

	    that.alarma = new five.Led(13);
	    that.luz1 = new five.Led(8);
	    that.luz2 = new five.Led(9);
	    that.aire1 = new five.Led(7);
	    that.aire2 = new five.Led(6);

	    //probe
	    
	    if(that.humos){
		that.alarma.on();
	    }
	    else {
		that.alarma.off();
	    }
	    
	    if(that.luces1){
		that.luz1.on();
	    }
	    else {
		that.luz1.off();
	    }

	    if(that.luces2){
		that.luz2.on();
	    }
	    else {
		that.luz2.off();
	    }

	    if(that.aires1){
		that.aire1.on();
	    }
	    else {
		that.aire1.off();
	    }

	    if(that.aires2){
		that.aire2.on();
	    }
	    else {
		that.aire2.off();
	    }

	    if(that.airesC == 1){
		that.aire1.brightness(64);
	    }
	    if (that.airesC == 2){
		that.aire1.brightness(128);
	    }
	    if (that.airesC == 3){
		that.aire1.brightness(200);
	    }
	    if (that.airesC == 4){
		that.aire1.brightness(255);
	    }

	    if(that.airesC2 == 1){
		that.aire2.brightness(64);
	    }
	    if (that.airesC2 == 2){
		that.aire2.brightness(128);
	    }
	    if (that.airesC2 == 3){
		that.aire2.brightness(200);
	    }
	    if (that.airesC2 == 4){
		that.aire2.brightness(255);
	    }

	    // development
	    that.liq_a.on('hold', function(data){
		var registry = that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, positiveValue, counterLiquidsA, true);
	    });

	    that.liq_a.on('up', function(data){
		var object = that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, negativeValue, counterLiquidsA, false);
	    });

	    that.liq_b.on('hold', function(data){
		var object = that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, positiveValue, counterLiquidsB, true);
	    });

	    that.liq_b.on('up', function(data){
		var object = that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, negativeValue, counterLiquidsB, false);
	    });

	    that.hum_a.on('hold', function(data){
		var object = that.sendSocketAndMaybeStoreRegistry(Storage.data.Humo, positiveValue, counterSmog, true);
	    });

	    that.hum_a.on('up', function(data){
		var object = that.sendSocketAndMaybeStoreRegistry(Storage.data.Humo, negativeValue, counterSmog, false);
		return object;
	    });

	    that.t_rack.on('data', function() {
		/*
		 var  tr = (5 * this.value * 100) / 1024;
		 var  tro = tr.toFixed(2);
		 */
	    });

	});
    };

};

Monitduino.prototype.setupSerialPort = function() {
    var that = this;
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

	if(time === 5){
	    var alertForTemperature = (object.Celsius >= Storage.schemas.Temperatura.schema.max);
	    var alertForHumidity = (object.Humedad >= Storage.schemas.Humedad.schema.max);
	    that.sendSocketAndMaybeStoreRegistry(Storage.data.Celsius, object.Celsius, counterTemperature, alertForTemperature ? true : false);
	    that.sendSocketAndMaybeStoreRegistry(Storage.data.Humedad, object.Humedad, counterHumidity, alertForHumidity ? true : false);
            time = 0;
	}
    });
};

module.exports = Monitduino;

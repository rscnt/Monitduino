var Storage = new require("./storage"),
    storage = new Storage();
var _ = require("lodash");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'monitduino@gmail.com',
        pass: 'monitduino2014'
    }
});
var twitlio = require("twilio");
var clientTwitlio = new twitlio.RestClient("AC8191d0a24073858a6c78199f14467e73", "e012540e9eb712f6049936cbe1581427");
/*
var redis = new require("redis"),
    client = redis.createClient();
*/
var socketIO;
var five = require("johnny-five"),
com = require("serialport");
var serialPort = new com.SerialPort("/dev/ttyACM0", {
	baudrate: 9600,
	parser: com.parsers.readline('\r\n')
});


var time = 0;
var timelcd = 0;
var lcdready = 0;
var l_a = 0;
var l_b = 0;
var h = 0;
var cel = 0;
var hum = 0;
var counterLiquidsA = 0;
var counterLiquidsB = 0;
var counterLiquidsC = 0;
var counterTemperature = 0;
var counterHumidity = 0;
var counterSmog = 0;
var counterDoor = 0;
var counterLuz = 0;
var counterLuz2 = 0;
var datoT = [];
var datoH = [];
var regexp = /(^([\d.,])*)$/;

var Monitduino = function(){
    var that = this;
    this.socketIO = null;
    this.nNotifications = null;
    this.liq_a = 0;
    this.liq_b = 0;
    this.liq_c = 0;
    this.hum_a = 0;
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
    this.lcd = null;
    this.lcd_2 = null;
    this.l1 = 0;
    this.l2 = 0;
    this.l3 = 0;
    this.l4 = 0;
    this.l5 = 0;
    this.l6 = 0;
    this.l7 = 0;
    this.l8 = 0;

    /*
    client.get("numberOfAlerts", function(err, reply) {
	if (err) { console.log(err); }
	if (reply !== undefined && reply !== null) {
	    that.nNotifications = reply;
	} else {
	    that.nNotifications = 0;
	}
    });
	*/
};

Monitduino.enabledCalls = false;

Monitduino.globals = {alarms:{
    state: false, 
    humo: false, 
    liquidos: false, 
    liquidoA: false,
    liquidoB: false,
    liquidoC: false,
    temperatura: false, 
    huemdad: false
}};

Monitduino.prototype.buildChartOf = function(dataName, DOMContainer) {
      Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });
};

Monitduino.prototype.setAlertState = function(state, name) {
    console.log("State : " + state + " and Name is : " + name);
    if (state) {
	switch(name) {
	case Storage.schemas.Temperatura.schema.name:
	    Monitduino.globals.alarms.temperatura = true;
	    break;
	case  Storage.schemas.Humedad.schema.name:
	    Monitduino.globals.alarms.humedad = true;
	    break;
	case  Storage.schemas.Humo.schema.name:
	    Monitduino.globals.alarms.humo = true;
	    break;
	case  Storage.schemas.LiquidoA.schema.name:
	    Monitduino.globals.alarms.liquidoA = true;
	    Monitduino.globals.alarms.liquidos = true;
	    break;
	case  Storage.schemas.LiquidoB.schema.name:
	    Monitduino.globals.alarms.liquidoB = true;
	    Monitduino.globals.alarms.liquidos = true;
	    break;
	case  Storage.schemas.LiquidoC.schema.name:
	    Monitduino.globals.alarms.liquidoC = true;
	    Monitduino.globals.alarms.liquidos = true;
	    break;
	}
    } else {
	console.log("Monitduino");
	Monitduino.globals.alarms = {
	    state: state, 
	    humo: false, 
	    liquidos: false,
	    liquidoA: false,
	    liquidoB: false,
	    liquidoC: false,
	    temperatura: false, 
	    humedad: false
	};
    }
    Monitduino.globals.alarms.state = state;
};


Monitduino.emails = [
    "reascencio@grupoautofacil.com",
    "henanty@gmail.com",
    "rascnt@gmail.com"
];

var sendAMailToABrotha = function(subject, bodyText, warpHtml) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: 'Monitduino sistema de alertas ✔ <monitduino@gmail.com>', // sender address
        to: Monitduino.emails.join(","), // list of receivers
        subject: subject, // Subject line
        text: bodyText, // plaintext body
        html: warpHtml // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
};

var sendACallToABrotha = function (name, value) {
    // A simple example of making a phone call using promises
    if (Monitduino.enabledCalls) {
        var promise = clientTwitlio.makeCall({
            to:'+50371017545', 
            from:'+50321133252 ',
            url:'http://rscnt.com:8080/?name='+name+'&value='+value
        });
        Monitduino.enabledCalls = false;
        promise.then(function(call) {
            console.log('Se llamo a : '+call.sid);
        }, function(error) {
            console.error('La llamada fallo: '+error.message);
            
        });    
    }
};

var getFormattedDate = function() {
    var date  = new Date();
    var formatD = date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() +":" + date.getMinutes() + ":" + date.getSeconds() + ":" + date.getMilliseconds();
    return formatD;
};

Monitduino.prototype.sendSocketAndMaybeStoreRegistry = function(name, value, counter, store) {
	var valor = value;
	var registry = {name: name, value: value};
	if (storage !== undefined && storage !== null) {
		storage.createRegistry(registry.name, registry.value);	
	} else { console.log("storage not defined"); }
	this.count = 0;
    var alertBodyText;
	if (this.socketIO !== undefined && this.socketIO !== null) {
		switch(registry.name){
			case "Temperatura":
			case "temperatura":
			datoT.push([registry.value]);
			that.l5.off();
			that.l6.on();
			if (registry.value >= Storage.schemas.Temperatura.schema.max) {
			    this.activatedesalarm(true, Storage.schemas.Temperatura.schema.name);
			    this.socketIO.sockets.emit('alert', {name: "temperatura", value: registry.value});
                alertBodyText = "Los niveles de temperatura han alcanzdo o sobrepasado su maximo nivel, valor registrado:  " + registry.value + ", tiempo: " + getFormattedDate();
                sendAMailToABrotha("Alerta, Temperatura Alta", 
                                   alertBodyText,
                                  "<p>Los niveles de temperatura han alcanzdo o sobrepasado su maximo nivel</p> " + 
                                      "<p>Valor registrado:  " + registry.value + ",  tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
                that.l5.on();
				that.l6.off();
			}
			this.socketIO.sockets.emit('promt', datoT);
			break;
			case "Humedad":
			case "humedad":
			datoH.push([registry.value]);
			that.l7.off();
			that.l8.on();
			if (registry.value >= Storage.schemas.Humedad.schema.max) {
			    this.activatedesalarm(true, Storage.schemas.Humedad.schema.name);
			    this.socketIO.sockets.emit('alert', {name: "humedad", value: registry.value});
                alertBodyText =  "Niveles de humedad demasiado altos:  " + registry.value + ", tiempo: " + getFormattedDate();
                sendAMailToABrotha("Humedad detectada", 
                                  alertBodyText,
                                  "<p>Niveles de humedad demasiado altos</p> <p>Valor registrado:  " + registry.value + ", tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
                that.l7.on();
				that.l8.off();
			}
			this.socketIO.sockets.emit('humt', datoH);
			break;
			case "liquidoA":
			case "LiquidoA":
			if (registry.value >= Storage.schemas.LiquidoB.schema.max) {
			    this.activatedesalarm(true, Storage.schemas.LiquidoA.schema.name);
			    this.socketIO.sockets.emit('alert', {name: "liquidoA", value: registry.value});
                alertBodyText = "Liquidos dectectados por el sensor numero 1, tiempo: " + getFormattedDate();
                sendAMailToABrotha("Liquidos detectados", 
                                   alertBodyText,
                                  "<p>Liquidos dectectados por el sensor numero 1, tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
			}
			break;
			case "liquidoB":
			case "LiquidoB":
			if (registry.value >= Storage.schemas.LiquidoB.schema.max) {
			    this.activatedesalarm(true, Storage.schemas.LiquidoB.schema.name);
				this.socketIO.sockets.emit('alert', {name: "liquidoB", value: registry.value});
                alertBodyText = "Liquidos dectectados por el sensor numero 2, tiempo: " + getFormattedDate();
                sendAMailToABrotha("Liquidos detectados", 
                                  alertBodyText,
                                  "<p>Liquidos dectectados por el sensor numero 2, tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
			}
			break;
			case "liquidoC":
			case "LiquidoC":
			if (registry.value >= Storage.schemas.LiquidoC.schema.max) {
			    this.activatedesalarm(true, Storage.schemas.LiquidoC.schema.name);
			    this.socketIO.sockets.emit('alert', {name: "liquidoC", value: registry.value});
                alertBodyText = "Liquidos dectectados por el sensor numero 3, tiempo: " + getFormattedDate();
                sendAMailToABrotha("Liquidos detectados", 
                                  alertBodyText,
                                  "<p>Liquidos dectectados por el sensor numero 3, tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
			}
			break;
			case "humo":
			case "humo":
			if (registry.value) {
			    this.activatedesalarm(true, Storage.schemas.Humo.schema.name);
			    this.socketIO.sockets.emit('alert', {name: "humo", value: registry.value});
                alertBodyText ="Humo dectectado, tiempo: " + getFormattedDate();
                sendAMailToABrotha("Presencia de humo detectado ", 
                                  alertBodyText,
                                  "<p>Humo dectectado, tiempo: " + getFormattedDate() + "</p>"
                                  );
                sendACallToABrotha(registry.name, registry.value);
			}
			break;
			case "principal":
			if (registry.value){
				this.socketIO.sockets.emit('estP', registry.value);
				//console.log("enviando puerta");
				//console.log(registry.value);
			}
			break;
			case "usuario":
			if (registry.value){
				this.socketIO.sockets.emit('usuario', registry.value);
				//console.log("enviando usuario");
			}
			break;
			case "luz_1":
			if (registry.value){
				this.socketIO.sockets.emit('estL', registry.value);
				console.log(registry.value);
			}
			break;
			case "luz_2":
			if (registry.value){
				this.socketIO.sockets.emit('estL2', registry.value);
			}
			break;
			case "aire_1":
			if (registry.value){
				this.socketIO.sockets.emit('estA', registry.value);
				console.log(registry.value);
			}
			break;			
		};   

		this.socketIO.sockets.emit('general', registry); 
	} 
	else { console.log("SOCKET IO not found"); }
	return registry;
};

Monitduino.prototype.initStorage = function() {
	storage.init();
};

Monitduino.prototype.setSocket = function(io) {
     this.socketIO = io;
 };

Monitduino.prototype.setupSocketEvents = function(socket){
	var that = this;

	socket.on('humo', function(data) {
		that.humos = data;
		that.activatedesalarm(data);
		console.log(data);
	});

    socket.on('foo', function(data) {
    	console.log(data);
    });

    socket.on('luz1', function(data){
    	var est = data;
		that.luces1 = est;
		that.activarluz1(est);
		console.log(est + "Hola");
    });

    socket.on('luz2', function(data){
    	that.luces2 = data;
    	that.activarluz2(data);
    	console.log(data);
    	console.log(data + "Hola2");
    });

    socket.on('air1', function(data){
    	that.aires1 = data;
    	that.activaraire1(data);
    	console.log(data + "Hola3");
    });

    socket.on('air2', function(data){
    	that.aires2 = data;
    	that.activaraire2(data);
    });

    socket.on('a1control', function(data){
    	that.airesC = data;
    	that.controlaire1(data);
    	console.log(data + "Hola4");
    });

    socket.on('a2control', function(data){
    	that.airesC2 = data;
    	that.controlaire2(data);
    });

    socket.on('schemaData', function(data) {
    	_.forEach(Storage.schemas, function(schema) {
    		console.log(data.name);
    		console.log(schema.schema.name);
	    	if (schema.schema.name === data.name) {
	    		console.log(schema.schema);
	    		schema.schema.max = data.max;
	    		schema.schema.min = data.min;
	    	}
	    });
    });
};

Monitduino.prototype.activarluz1 = function(activate){
	var result = false;
	if(this.luz1 !== null && this.luz1 !== undefined){
		activate ? this.luz1.on() : this.luz1.off();
		result = true;
	}
	return result;
};

Monitduino.prototype.activarluz2 = function(activate){
	var result = false;
	if(this.luz2 !== null && this.luz2 !== undefined){
		activate ? this.luz2.on() : this.luz2.off();
		result = true;
	}
	return result;
};

Monitduino.prototype.activaraire1 = function(activate){
	var result = false;
	if(this.aire1 !== null && this.aire1 !== undefined){
		activate ? this.aire1.on() : this.aire1.off();
		result = true;
	}
	return result;
};

Monitduino.prototype.activaraire2 = function(activate){
	var result = false;
	if(this.aire2 !== null && this.aire2 !== undefined){
		activate ? this.aire2.on() : this.aire2.off();
		result = true;
	}
	return result;
};

Monitduino.prototype.controlaire1 = function(control){
	var result = false;
	if(this.aire1 !== null && this.aire1 !== undefined){
		if (control === 1){
			this.aire1.brightness(64);
		}
		if (control === 2){
			this.aire1.brightness(128);
		}
		if (control === 3){
			this.aire1.brightness(190);
		}
		if (control === 4){
			this.aire1.brightness(255);
		}
	}
	return result;
};

Monitduino.prototype.controlaire2 = function(control){
	var result = false;
	if(this.aire2 !== null && this.aire2 !== undefined){
		if (control ===  1){
			this.aire2.brightness(64);
		}
		if (control === 2){
			this.aire2.brightness(128);
		}
		if (control === 3){
			this.aire2.brightness(190);
		}
		if (control === 4){
			this.aire2.brightness(255);
		}
	}
	return result;
};

Monitduino.prototype.activatedesalarm = function(activate, name){
	var result = false;
	if(this.alarma !== null && this.alarma !== undefined) {
	    if(activate || activate === undefined) {
		this.setAlertState(true, name);
		this.socketIO.sockets.emit("onAlarmStatesChanged", Monitduino.globals.alarms);
		this.alarma.on();
	    } else {
		this.setAlertState(false);
		this.socketIO.sockets.emit("onAlarmStatesChanged", Monitduino.globals.alarms);
		this.alarma.off();
	    }
		result = true;
	}
	return result;
};

Monitduino.prototype.activateLCD = function(activate){
	var result = false;
	if(this.lcd_2 !== null && this.lcd_2 !== undefined){
			that.lcd_2.clear();
	    	that.lcd_2.print("Bienvenido");
	    	that.lcd_2.cursor(1, 0);
	    	that.lcd_2.print("Pase su tarjeta");
		if(activate === 1){
			this.lcd_2.clear();
			this.lcd_2.print("Usuario Correcto");
			this.lcd_2.cursor(1,0);
			this.lcd_2.print("Bienvenido U.1");
		}
		if(activate === 2){
			this.lcd_2.clear();
			this.lcd_2.print("Usuario Correcto");
			this.lcd_2.cursor(1,0);
			this.lcd_2.print("Bienvenido U.2");
		} 
		if(activate === 3){
			this.lcd_2.clear();
			this.lcd_2.print("Usuario Incorrecto");
			this.lcd_2.cursor(1,0);
			this.lcd_2.print("Revise Usuario");
		}
	}
}
Monitduino.prototype.activateLCD2 = function(temp, hum){
	var result = false;
	if(this.lcd !== null && this.lcd !== undefined){
			this.lcd.clear();
			this.lcd.print("Temper: ");
			this.lcd.print(temp);
			this.lcd.cursor(1,0);
			this.lcd.print("Humedad: ");
			this.lcd.print(hum);
	}
}


var negativeValue = "0", positiveValue = "1";

Monitduino.prototype.setupBoard = function ()  {

	var that = this;
	that.board = five.Board();
	if (that.board) {
		that.board.on("ready", function(){

			var lcdB = 0;

			that.liq_a = new five.Button({
				board: that.board,
				pin: 22,
				holdtime: 3000,
				invert: true
			});

			that.liq_b = new five.Button({
				board: that.board,
				pin: 23,
				holdtime: 3000,
				invert: true
			});

			that.liq_c = new five.Button({
				board: that.board,
				pin: 24,
				holdtime: 3000,
				invert: true
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

			var lcdButton = new five.Button({
				board: that.board,
				pin: 10,
				holdtime: 1000	
			});

		    that.alarmaButton = new five.Button({
			board: that.board,
			pin: 26
		    });

		    that.luz_1 = new five.Button({
		    	board: that.board,
		    	pin: 40,
		    	holdtime: 500,
		    	invert: false
		    });
		    
		    that.luz_2 = new five.Button({
		    	board: that.board,
		    	pin: 41,
		    	holdtime: 500,
		    	invert: false
		    });

		    that.aire_1 = new five.Button({
		    	board: that.board,
		    	pin: 42,
		    	holdtime: 500,
		    	invert: false
		    });

			that.alarma = new five.Led(14);
			that.luz1 = new five.Led(30);
			that.luz2 = new five.Led(31);
			that.aire1 = new five.Led(9);
			that.aire2 = new five.Led(8);
			that.l1 = new five.Led(32);
			that.l2 = new five.Led(33);
			that.l3 = new five.Led(34);
			that.l4 = new five.Led(35);
			that.l5 = new five.Led(36);
			that.l6 = new five.Led(37);
			that.l7 = new five.Led(38);
			that.l8 = new five.Led(39);

			that.lcd = new five.LCD({
				pins: [15, 16, 21, 20, 19, 18]
			});

			that.lcd_2 = new five.LCD({
				pins: [40, 41, 42, 43, 44, 45]
			});
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
	    	that.aire1.brightness(128);
	    }
	    else {
	    	that.aire1.off();
	    }

	    if(that.aires2){
	    	that.aire2.brightness(128);
	    }
	    else {
	    	that.aire2.off();
	    }

	    if(that.airesC === 1){
	    	that.aire1.brightness(64);
	    }
	    if (that.airesC === 2){
	    	that.aire1.brightness(128);
	    }
	    if (that.airesC === 3){
	    	that.aire1.brightness(200);
	    }
	    if (that.airesC === 4){
	    	that.aire1.brightness(255);
	    }

	    if(that.airesC2 === 1){
	    	that.aire2.brightness(64);
	    }

	    if (that.airesC2 === 2){
	    	that.aire2.brightness(128);
	    }

	    if (that.airesC2 == 3){
	    	that.aire2.brightness(200);
	    }

	    if (that.airesC2 === 4){
	    	that.aire2.brightness(255);
	    }

	    // development
	    that.liq_a.on('hold', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, positiveValue, counterLiquidsA, true);
	    	that.l1.on();
	    	that.l2.off();
	    });

	    that.liq_a.on('up', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoA, negativeValue, counterLiquidsA, false);
	    	that.l1.off();
	    	that.l2.on();
	    });

	    that.liq_b.on('hold', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, positiveValue, counterLiquidsB, true);
	    	that.l1.on();
	    	that.l2.off();
	    });

	    that.liq_b.on('up', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoB, negativeValue, counterLiquidsB, false);
	    	that.l1.off();
	    	that.l2.on();
	    });

	     that.liq_c.on('hold', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoC, positiveValue, counterLiquidsC, true);
	    	that.l1.on();
	    	that.l2.off();
	    });

	    that.liq_c.on('up', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.LiquidoC, negativeValue, counterLiquidsC, false);
	    	that.l1.off();
	    	that.l2.on();
	    });

	    that.hum_a.on('hold', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Humo, positiveValue, counterSmog, true);
	    	that.l3.on();
	    	that.l4.off();
	    });

	    that.hum_a.on('up', function(data){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Humo, negativeValue, counterSmog, false);
	    	that.l3.off();
	    	that.l4.on();
	    });

	    that.alarmaButton.on("down", function(data){
	    	that.setAlertState(true);
	    });

	    that.alarmaButton.on("up", function(data){
	    	that.setAlertState(false);
	    });
		 
	    that.t_rack.on('data', function() {
		/*
		 var  tr = (5 * this.value * 100) / 1024;
		 var  tro = tr.toFixed(2);
		 */
		});

	    that.luz_1.on('hold', function(){
	    	console.log("==========================================================");
	    	console.log("====================== X =================================");
	    	console.log("==========================================================");
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Luz_1, positiveValue, 0, false);
	    });
	    that.luz_1.on('up', function(){
	    	console.log("==========================================================");
	    	console.log("====================== X =================================");
	    	console.log("==========================================================");
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Luz_1, negativeValue, 0, false);
	    });
	    that.luz_2.on('hold', function(){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Luz_2, positiveValue, 0, false);
	    });
	    that.luz_2.on('up', function(){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Luz_2, negativeValue, 0, false);
	    });
	    that.aire_1.on('hold', function(){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Aire_1, positiveValue, 0, false);
	    });
	    that.aire_1.on('up', function(){
	    	that.sendSocketAndMaybeStoreRegistry(Storage.data.Aire_1, negativeValue, 0, false);
	    });

	    
	    that.lcd.on("ready", function() {
	    	that.lcd.clear();
	    	that.lcd.print("Monitduino");
	    	that.lcd.cursor(1, 0);
	    	that.lcd.print("Panel de control")
	    });
	    that.lcd_2.on("ready", function() {
	    	that.lcd_2.clear();
	    	that.lcd_2.print("Bienvenido");
	    	that.lcd_2.cursor(1, 0);
	    	that.lcd_2.print("Pase su tarjeta");
	    	lcdready = 1;
	    });

		var refrescarLCD = function(act){
			that.lcd.on("ready", function() { console.log("lcd ready"); });
			if(act === 1){
				that.lcd.on("ready", function() { console.log("lcd ready"); });
				that.lcd.clear();
				that.lcd.print("Temperatura:");
				that.lcd.print(cel);
				that.lcd.cursor(1, 0);
				that.lcd.print("Humedad :");
				that.lcd.print(hum);
			}
			else{
				that.lcd.on("ready", function() { console.log("lcd ready"); });
				that.lcd.clear();
			}
		}; 

	    lcdButton.on('hold', function(){
	    	console.log("Algo");
	    });

	    lcdButton.on('up', function(){
	    	console.log("Otra cosa");
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

        //recolecta info del puerto serial
        var info = data;
        var object = {
        	Celsius: '',
        	Humedad: '' 
        };
        // verificar la informacion
        console.log(info);
        var ok = regexp.test(info);
        if(ok){
        	time++;
        	timelcd++;
        	var ext = info.split(","); 			
        	//recoge la temperatura
                var celsius = parseFloat(ext[1]); 	
        	cel = celsius;
        	//recoge la humedad.
        	hum_ = parseFloat(ext[0]);
        	hum = hum_;
        	// result object
        	object  = {
        		Celsius: celsius,
        		Humedad: hum_
        	};
        	if(time === 1){
        		var alertForTemperature = (object.Celsius >= Storage.schemas.Temperatura.schema.max);
        		var alertForHumidity = (object.Humedad >= Storage.schemas.Humedad.schema.max);
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Celsius, object.Celsius, counterTemperature, alertForTemperature ? true : false);
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Humedad, object.Humedad, counterHumidity, alertForHumidity ? true : false);
        		time = 0;
        	}
        	if(timelcd === 10){
        		that.activateLCD2(cel, hum);
        	}

        }
        else {
        	//console.log("Puerta");
        	var puerta = info;
	        var infoPuerta = info.split(",");
        	var pstado = 0;
        	var pusuario = 0;
        	var pusuarioe = 0;
            var tmpPredicate = true;
            activateLCD();
        	if (infoPuerta[0] === "U1")
        	{
        		//console.log("Usuario Numero 1");
        		that.activateLCD(1);
        		pusuario = 1;
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Usuario, pusuario, counterDoor, tmpPredicate);
        		tmpPredicate = false;
        		setTimeout(function(){tmpPredicate = true;}, 2000);
        	}
        	else if (infoPuerta[0] === "U2")
        	{
        	    //console.log("Usuario Numero 2");
        	    that.activateLCD(2);
        	    pusuario = 2;
        	    that.sendSocketAndMaybeStoreRegistry(Storage.data.Usuario, pusuario, counterDoor, tmpPredicate);
        	    tmpPredicate = false;
        	    setTimeout(function(){tmpPredicate = true;}, 2000);
        	}
        	/*
        	else 
        	{
        		//console.log("Usuario Desconocido")
        		pusuario = 10;
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Usuario, pusuario, counterDoor, false);
        	}
        	*/
        	if (infoPuerta[1] === "UC")
        	{
        		//console.log("Usuario Correcto");
        		pusuarioe = 11;
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Usuario, pusuarioe, counterDoor, true);
        	}
        	else if (infoPuerta[1] === "UI")
        	{
        		//console.log("Usuario Incorrecto");
        		that.activateLCD(3);
        		pusuarioe = 12;
        		that.sendSocketAndMaybeStoreRegistry(Storage.data.Usuario, pusuarioe, counterDoor, true);
        	}
        	if (puerta == "AOP" || puerta == "OP" || puerta == "EOP" || puerta == "CP"){
        		console.log("estado puerta :" + puerta);
        		if(puerta == "OP")
        		{	
        			pstado = 1;
    				that.sendSocketAndMaybeStoreRegistry(Storage.data.Puerta, pstado, counterDoor, true);
        		}
        		if(puerta == "AOP" || puerta == "EOP")
        		{
        			pstado = 2;
        			that.sendSocketAndMaybeStoreRegistry(Storage.data.Puerta, pstado, counterDoor, true);
        		}
        		if(puerta == "CP")
        		{
        			pstado = 3;
        			that.sendSocketAndMaybeStoreRegistry(Storage.data.Puerta, pstado, counterDoor, true);
        		}
        	}
        }					

    });
};

module.exports = Monitduino;

var domain = "http://127.0.0.1:3000";
var socket = io.connect(domain);
var val_t = 0;
var val_h = 0;
var val_b = 0;
var val_l = 0;
var t = new Array();
var h = new Array();
var j = 0;

$("#liquid").text("No registro");
$("#humo").text("No registro");
/*
$("#tempt").text("No registro");
$("#humid").text("No registro");
*/
var fetchData = function(name, callback) {
    var url = domain + "/" + name + "/data";
    $.get(url, function(data){
	console.log(data);
	if (callback) {
	    callback(data);
	}
    });
};

var formatDate = function(stringDate) {
    var date = Date.parse(stringDate),
	dDate = moment(date).format("MMMM Do YYYY, h:mm:ss a");
    return dDate;
};

var displayBlockOfAlert = function(b){
    var redBlock = "<div style=\"background: red; width: 100%; height: 10px; display: block;\"></div>";
    var whiteBlock = "<div style=\"background: white; width: 100%; height: 10px; display: block;\"></div>";
    return b ? redBlock : whiteBlock;
};

var $temperaturaDataTable;
var refreshTemperatruaDataTable = function() {
    $temperaturaDataTable = $("#temperatura-data-table");
    if ($temperaturaDataTable) {
	fetchData("temperatura", function(data){
	    if (data) {
		for(var i in data.items) {
		    var dDate = formatDate(data.items[i].date);
		    var alert = displayBlockOfAlert(data.items[i].AlertId);
		    $temperaturaDataTable.find("tbody").append (
			"<tr><td> " + data.items[i].name  + "</td> " +
			    "<td>" + dDate  +  "</td>" + 
			    "<td>" + data.items[i].value  + "</td>" + 
			    "<td>" + alert + "<td>"
			    +"</tr>"
		    );
		}
	    }
	});
    }
};

var $humedadDataTable;
var refreshHumedadDataTable = function() {
    console.log("Humedad");
    $humedadDataTable = $("#humedad-data-table");
    if ($humedadDataTable.length) {
	fetchData("humedad", function(data){
	    if (data !== null && data !== undefined) {
		for(var i in data.items) {
		    var dDate = formatDate(data.items[i].date);
		    var alert = displayBlockOfAlert(data.items[i].AlertId);
                   $humedadDataTable.find("tbody").append (
                       "<tr><td> " + data.items[i].name  + "</td> " +
                           "<td>" + dDate  +  "</td>" + 
                           "<td>" + data.items[i].value  + "</td>" + 
                           "<td>" + alert + "<td>"		    
			   +"</tr>"
		    );
		}
	    }
	});
    }
};

var $liquidosDataTable;
var refreshLiquidosTable = function() {
    $liquidosDataTable = $("#liquidos-data-table");
    if ($liquidosDataTable) {
	fetchData("liquidos", function(data){
	    $liquidosDataTable.find("tbody").html("");
	    for(var i in data.items) {
		var dDate = formatDate(data.items[i].date);
		var alert = displayBlockOfAlert(data.items[i].value);
		$liquidosDataTable.find("tbody").append(
		    "<tr><td>"+data.items[i].name+"</td>"+
			"<td>"+dDate+"</td>"+
			"<td>"+alert+"</td></tr>"
		);
	    }
	});
    }
};


var $humoDataTable;
var refreshHumoDataTable = function() {
    $liquidosDataTable = $("#humo-data-table");
    if ($liquidosDataTable) {
	fetchData("humo", function(data){
	    $liquidosDataTable.find("tbody").html("");
	    for(var i in data.items) {
		var dDate = formatDate(data.items[i].date);
		var alert = displayBlockOfAlert(data.items[i].value);
		$liquidosDataTable.find("tbody").append(
		    "<tr><td>"+data.items[i].name+"</td>"+
			"<td>"+dDate+"</td>"+
			"<td>"+alert+"</td></tr>"
		);
	    }
	});
    }
};

var $label_quantity_alerts = $("#alerts-quantity-label");
var $notificationSection = $("#notificationSection");
var stupidWayToBuildDOMForTheAlert = function(message, formatedTime, type) {
    var strDOM = "<li class=\"media\">";
    strDOM += "<a href=\"javascript;;\">";
    strDOM += "<div class=\"pull-left\">";
    strDOM += "<img src=\"\" class=\"media-object\" alt=\"\"/></div>";
    strDOM += "<div class=\"media-body\"";
    strDOM += "<h6 class=\"media-heading\">" + message + "</h6>";
    strDOM += "<div class=\"text-muted\">" + formatedTime + "</div>";
    strDOM += "</div></a><li>";
    return strDOM;
};
socket.on("alert", function(data){
    console.log("Alerta ");
    console.log(data);
    switch(data.name) {
    case "LiquidoA":
    case "liquidoA":
    case "LiquidoB":
    case "liquidoB":
    case "LiquidoC":
    case "liquidoC":
	$notificationSection.append(stupidWayToBuildDOMForTheAlert("Se ha detectado liquidos", moment(Date.now()).format("Do - MM hh:mm:ss")));
	break;
    case "Humedad":
    case "humedad":
	$notificationSection.append(stupidWayToBuildDOMForTheAlert("Se ha detectado humedad en el cuarto", moment(Date.now()).format("Do - MM hh:mm:ss")));
	break;
    case "Temperatura":
    case "temperatura":
	$notificationSection.append(stupidWayToBuildDOMForTheAlert("Se han detectado temperaturas altas", moment(Date.now()).format("Do - MM hh:mm:ss")));
	break;
    case "Humo":
    case "humo":
	$notificationSection.append(stupidWayToBuildDOMForTheAlert("Se han detectado precencia de humo", moment(Date.now()).format("Do - MM hh:mm:ss")));
	break;               
    }
});

socket.on('general', function (data) {
    switch(data.name) {
    case "temperatura":
    case "Temperatura":
	$("#tempt").text(data.value + " °C");
	socket.on('promt', function(data){
	    var res = [];
	    if(t.length == 0){
		for (var i = 0; i < data.length; ++i) {
		    res.push([i, data[i]]);
		}
		t = res;
	    } else {
		t.push([t.length+1, data[data.length - 1]]);
	    }
	});
	break;
    case "Humedad":
    case "humedad":
	$("#humid").text(data.value + " %");
	socket.on('humt', function(data){
	    var ras = [];
	    if(h.length == 0){
		for (var i = 0; i < data.length; ++i) {
		    ras.push([i, data[i]]);
		}
		h = ras;
	    } else {
		h.push([h.length+1, data[data.length - 1]]);
	    }
	});
	break;
    case "liquidoA":
    case "LiquidoA":
    case "liquidoB":
    case "LiquidoB":
    case "LiquidoC":
    case "liquidoC":
	if (data.value == "1"){
	    $( "#liquid.label-default" ).css("background-color", "#f89406");
	    $("#liquid").text("Activo.");
	}
	else if(data.value == "0"){
	    $( "#liquid.label-default" ).css("background-color", "#777");
	    $("#liquid").text("Inactivo.");
	}
	else {
		$("#liquid").text("No registro");
	}
	break;
    case "Humo":
    case "humo":
	if (data.value == "1"){
	    $( "#humo.label-default" ).css("background-color", "#f89406");
	    $("#humo").text("Activo");
	}
	else if(data.value == "0"){
	    $( "#humo.label-default" ).css("background-color", "#777");
	    $("#humo").text("Inactivo");
	}
	else {
		$("#humo").text("No registro");
	}
	break;
    }
});

socket.on('alerta', function (data) {
    switch(data.name) {
    case "temperatura":
    case "Temperatura":
	break;
    case "Humedad":
    case "humedad":
	break;
    case "liquido":
    case "Liquido":
	break;
    case "Humo":
    case "humo":
	break;
    }    
});

var $liquidoAEl = $("#liquidoA");
var $liquidoBEl = $("#liquidoB");
var $liquidoCEl = $("#liquidoC");
var $temperatureIndicator = $("#valor-temperatura-not-dashboard");
var $temperaturaIconDetail = $("#temperatura-icon-detail");
var $humedadIndicator = $("#valor-humedad-not-dashboard");
var $humedadIconDetail = $("#humedad-icon-detail");
socket.on('general', function(data){
    switch(data.name) {
    case "Humedad":
    case "humedad":
	if ($humedadIndicator) {
	    $humedadIndicator.html(data.value);
	}
	if (data.AlertId) {
	    $humedadIconDetail.css("color", "red");
	} else {
	    $humedadIconDetail.css("color", "white");
	}
  	break;
    case "Temperatura":
    case "temperatura":
	if ($temperatureIndicator) {
	    $temperatureIndicator.html(data.value);
	}
	if (data.AlertId) {
	    $temperaturaIconDetail.css("color", "red");
	} else {
	    $temperaturaIconDetail.css("color", "white");
	} 
	break;
    case "liquidoA":
    case "LiquidoA":
	if ($liquidoAEl) {
	    if (data.value === "1") {
		$liquidoAEl.css('color', '#ed0000');
	    } else {
		$liquidoAEl.css('color', '#fff');
	    }
	}
	break;
    case "liquidoB":
    case "LiquidoB":
	if ($liquidoBEl) {
	    if (data.value === "1") {
		$liquidoBEl.css('color', '#ed0000');
	    } else {
		$liquidoBEl.css('color', '#fff');
	    }
	}	
	break;
    case "LiquidoC":
    case "liquidoC":
	if ($liquidoCEl) {
	    if (data.value === "1") {
		$liquidoCEl.css('color', '#ed0000');
	    } else {
		$liquidoCEl.css('color', '#fff');
	    }
	}	
	break;
    }
}); 

socket.on('promt', function(data){
    var res = [];
    if(t.length == 0){
	for (var i = 0; i <= data.length; ++i) {
	    res.push([i, data[i]]);
	}
	t = res;
    } else {
	t.push([t.length+1, data[data.length - 1]]);
    }
    j++;
});

socket.on('humt', function(data){
    var ras = [];
    if(h.length == 0){
	for (var i = 0; i < data.length; ++i) {
	    ras.push([i, data[i]]);
	}
	h = ras;
    } else {
	h.push([h.length+1, data[data.length - 1]]);
    }
});

var encender = function (){
	$("#encender").click(function(){
		var state = 1;
		console.log("Boton Encendido");
		socket.emit('humo', state);
	});
};

var apagar = function(){
	$("#apagar").click(function(){
		var state = 0;
		console.log("Boton Apagado");
		socket.emit('humo', state);
	});
};

var encenderluz1 = function(){
	$("#luz1e").click(function(){
		var state = 1;
		socket.emit('luz1', state);

	});
};

var apagarluz1 = function(){
	$("#luz1o").click(function(){
		var state = 0;
		socket.emit('luz1', state);
	});
};

var encenderluz2 = function(){
	$("#luz2e").click(function(){
		var state = 1; 
		socket.emit('luz2', state);
	});
};

var apagarluz2 = function(){
	$("#luz2o").click(function(){
		var state = 0; 
		socket.emit('luz2', state);
	});
};

var encenderaire1 = function(){
	$("#air1e").click(function(){
		var state = 1; 
		console.log("BotonON");
		socket.emit('air1', state);
	});
};

var apagaraire1 = function(){
	$("#air1o").click(function(){
		var state = 0; 
		console.log("BotonApagado");
		socket.emit('air1', state);
	});
};

var encenderaire2 = function(){
	$("#air2e").click(function(){
		var state = 1; 
		socket.emit('air2', state);
	});
};

var apagaraire2 = function(){
	$("#air2o").click(function(){
		var state = 0; 
		socket.emit('air2', state);
	});
};

var controlaire1 = function(){
	var estado = 0;
	$("#a1b").click(function(){
		estado = 1;
		socket.emit('a1control', estado);
	});
	$("#a1m").click(function(){
		estado = 2;
		socket.emit('a1control', estado);
	});
	$("#a1o").click(function(){
		estado = 3;
		socket.emit('a1control', estado);
	});
	$("#a1a").click(function(){
		estado = 4;
		socket.emit('a1control', estado);
	});
};

var controlaire2 = function(){
	var estado = 0;
	$("#a2b").click(function(){
		estado = 1;
		socket.emit('a2control', estado);
	});
	$("#a2m").click(function(){
		estado = 2;
		socket.emit('a2control', estado);
	});
	$("#a2o").click(function(){
		estado = 3;
		socket.emit('a2control', estado);
	});
	$("#a2a").click(function(){
		estado = 4;
		socket.emit('a2control', estado);
	});
};

var pabierta = function (){
	$( "#pabierta.badge" ).css("background-color", "green");
	$("#pabierta").text("Puerta abierta");
	$( "#palabierta.badge" ).css("background-color", "gray");
	$("#palabierta").text("Nada");
	$( "#pcerrada.badge" ).css("background-color", "gray");
	$("#pcerrada").text("Nada");
}
var pcerrada = function (){
	$( "#pabierta.badge" ).css("background-color", "gray");
	$("#pabierta").text("Nada");
	$( "#palabierta.badge" ).css("background-color", "gray");
	$("#palabierta").text("Nada");
	$( "#pcerrada.badge" ).css("background-color", "red");
	$("#pcerrada").text("Puerta Cerrada");
}
var alertapuerta = function (){
	$( "#pabierta.badge" ).css("background-color", "gray");
	$("#pabierta").text("Nada");
	$( "#palabierta.badge" ).css("background-color", "yellow");
	$("#palabierta").text("Alerta, puerta abierta");
	$( "#pcerrada.badge" ).css("background-color", "gray");
	$("#pcerrada").text("Nada");
}
var controlpuerta = function()
{
	socket.on('estP', function(data) {
		var estado = data;
		console.log(estado);
		if(estado === 1){
			pabierta();
		}
		else if (estado === 2){
			alertapuerta();
		}
		else if (estado === 3){
			pcerrada();
		}

	});
}
var controlusuario = function(valor){
	if(valor == 1){
		$( "#usuario.badge" ).css("background-color", "CadetBlue");
		$("#usuario").text("Kevin Vasquez");
	}
	else if(valor == 2){
		$( "#usuario.badge" ).css("background-color", "CadetBlue");
		$("#usuario").text("Lisandro Guardado");	
	}
	/*
	else if(valor == 10){
		$( "#usuario.badge" ).css("background-color", "Tomato");
		$("#usuario").text("Usuario Desconocido");	
	}
	*/
	else if(valor === 11){
		$( "#uscorrecto.badge" ).css("background-color", "MediumSeaGreen");
		$("#uscorrecto").text("Usuario Correcto");	
	}
	else if(valor === 12){
		$( "#usincorrecto.badge" ).css("background-color", "FireBrick");
		$("#usincorrecto").text("Usuario Incorrecto");	
	}
	else{
		$( "#usuario.badge" ).css("background-color", "gray");
		$("#usuario").text("Nadie");
		$( "#uscorrecto.badge" ).css("background-color", "gray");
		$("#uscorrecto").text("Nada");
		$( "#usincorrecto.badge" ).css("background-color", "gray");
		$("#usincorrecto").text("Nada");	
	}
}

var usuariopuerta = function()
{
	socket.on('usuario', function(data){
		var usuario = data;
		if(usuario === 1){
			controlusuario(1);
			//console.log("Kevin Vasquez");
		}
		else if(usuario === 2){
			controlusuario(2);
			//console.log("Lisandro Guardado");
		}
		/*
		else if(usuario === 10){
			controlusuario(10);
		}
		*/
		else if(usuario === 11){

		}
		else{
			controlusuario();
		}
	});
}
refreshLiquidosTable();
refreshTemperatruaDataTable();
refreshHumoDataTable();
refreshHumedadDataTable();
refreshLiquidosTable();
encender();
apagar();
encenderluz1();
apagarluz1();
encenderluz2();
apagarluz2();
encenderaire1();
apagaraire1();
encenderaire2();
apagaraire2();
controlaire1();
controlaire2();
controlpuerta();
usuariopuerta();
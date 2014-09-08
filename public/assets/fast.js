var domain = "http://127.0.0.1:3000";
var socket = io.connect(domain);
var val_t = 0;
var val_h = 0;
var val_b = 0;
var val_l = 0;
var t = new Array();
var h = new Array();
var j = 0;


var fetchData = function(name, callback) {
    var url = domain + "/" + name + "/data";
    console.log(url);
    $.get(url, function(data){
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
    if ($humedadDataTable) {
	fetchData("humedad", function(data){
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


socket.on('general', function (data) {
    switch(data.name) {
    case "temperatura":
    case "Temperatura":
	$("#tempt").text(data.value + " C");
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
	    $("#humo").text("ON");
	}
	else if(data.value == "0"){
	    $( "#humo.label-default" ).css("background-color", "#777");
	    $("#humo").text("OFF");
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



refreshLiquidosTable();
refreshTemperatruaDataTable();
refreshHumoDataTable();
refreshHumedadDataTable();

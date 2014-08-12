var socket = io.connect('http://192.168.1.4:3000');
var val_t = 0;
var val_h = 0;
var val_b = 0;
var val_l = 0;
var t = new Array();
var h = new Array();

socket.on('general', function (data) {
  switch(data.name) {
    case "temperatura":
    case "Temperatura":
    $("#tempt").text(data.value + " C");
    console.log("Temperatura valor: " + data.value);
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
    console.log("Humedad valor: " + data.value);
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
    case "liquido":
    case "Liquido":
    if (data.value == "1"){
      $( "#liquid.label-default" ).css("background-color", "#f89406");
      $("#liquid").text("ON");
    }
    else if(data.value == "0"){
      $( "#liquid.label-default" ).css("background-color", "#777");
      $("#liquid").text("OFF");
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
/*
  socket.on('b_', function(data){
  		val_b = data;
  		if (val_b == "1"){
  			$( "#humo.label-default" ).css("background-color", "#f89406");
  			$("#humo").text("ON");
  		}
  		else if(val_b == "0"){
  			$( "#humo.label-default" ).css("background-color", "#777");
  			$("#humo").text("OFF");
  		}
  	});

  socket.on('l_', function(data){
    val_l = data;
    if (val_l == "1"){
        $( "#liquid.label-default" ).css("background-color", "#f89406");
        $("#liquid").text("ON");
      }
      else if(val_l == "0"){
        $( "#liquid.label-default" ).css("background-color", "#777");
        $("#liquid").text("OFF");
      }
  });
*/
/*
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

*/



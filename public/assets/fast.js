var socket = io.connect('http://localhost:3000');
var val_t = 0;
var val_h = 0;
var val_b = 0;
var val_l = 0;
var t = new Array();

socket.on('general', function (data) {
  switch(data.name) {
    case "temperatura":
    case "Temperatura":
      $("#tempt").text(data.value + "C");
      console.log("Temperatura valor: " + data.value);
    break;
    case "Humedad":
    case "humedad":
      $("#humid").text(data.value + "%");
      console.log("Humedad valor: " + data.value);
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

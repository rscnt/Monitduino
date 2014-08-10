var socket = io.connect('http://localhost:3000');
var hum;
var g;

g = new JustGage({
    id: "gauge", 
    value: getRandomInt(-10, 40),
    min: -10,
    max: 40,
    title: "Rack 1",
    label: "°C",
  }); 

h = new JustGage({
    id: "tem2",
    value: 0,
    min: -10,
    max: 40,
    title: "Rack 2",
    label: "°C",
    })

socket.on('temp_1', function(data){
	tem1 = data;
	g.refresh(tem1, 40);	
});

socket.on('temp_2', function(data){
    tem2 = data
    g.refresh(tem2, 40)
})
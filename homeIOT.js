// API
// Fetch temperature send GET to http://IOTCARD:XXXX/temperature receive as example {"value":34.10894050905481,"time":"11:30:90","date":"21/10/2014"}
// Switch lamp on/of send POST with JSON {"lampstate":false} on body to http://IOTCARD:XXXX/switchlamp, receive statuscode 200 if on and 201 if off
// Fetch lamp state send GET to http://IOTCARD:XXXX/switchlamp, receive statuscode 200 if on and 201 if off

var express = require('express');
var bodyParser = require('body-parser')
var Gpio = require("onoff").Gpio;
var led = new Gpio(18,"out");
var pythonShell = require('python-shell');
var date = require('date-and-time');

var options = {

	mode:'text',
	pythonPath:'python',
	pythonOptions:['-u'],
};

var app = express();
var lampON = false;
var Temperature = function (value, time, date) {
    this.value = value;
    this.time = time;
    this.date = date;
};

app.use(bodyParser.json());

app.get('/switchlamp', function (req, res){

	if (led.readSync() === 1) {
		console.log("Lamp is on !")
		res.sendStatus(200);
	} else {
		console.log("Lamp is off !")
		res.sendStatus(201);
	}	

});

app.post('/switchlamp',function (req, res) {
	console.log("Change lamp state "+JSON.stringify(req.body));

	lampON = req.body.lampstate;

	if (lampON) {
		led.writeSync(1);
		res.sendStatus(200);	
	} else {
		led.writeSync(0);
		res.sendStatus(201);
	}	
	
});

app.get('/temperature', function (req, res) {
  
  pythonShell.run('readTemp.py', options, function(err, results) {

	console.log('results %j',results);
	var now = new Date();
	var hour = date.format(now,'HH:mm:ss');	
	var day = date.format(now,'DD/MM/YYYY');

        console.log('hour %j',hour);
        console.log('day %j', day);
	console.log('temp %j',results[0]);

	var tempValue = parseFloat(results[0]);

        var temperature = new Temperature(tempValue,hour,day);   
        res.send(JSON.stringify(temperature));
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('HOME IOT ---> listening at http://%s:%s', host, port);
});

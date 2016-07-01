// API
// Fetch temperature send GET to http://IOTCARD:XXXX/temperature receive as example {"value":34.10894050905481,"time":"11:30:90","date":"21/10/2014"}
// Switch lamp on/of send POST with JSON {"lampstate":false} on body to http://IOTCARD:XXXX/switchlamp, receive statuscode 200 if on and 201 if off
// Fetch lamp state send GET to http://IOTCARD:XXXX/switchlamp, receive statuscode 200 if on and 201 if off

var express = require('express');
var bodyParser = require('body-parser')
var app = express();

var lampON = false;

var Temperature = function (value, time, date) {
    this.value = value;
    this.time = time;
    this.date = date;
};

app.use(bodyParser.json());

app.get('/switchlamp', function (req, res){

	if (lampON) {
		res.send(200);
	} else {
		res.send(201);
	}	

});

app.post('/switchlamp',function (req, res) {
	console.log("Change lamp state "+JSON.stringify(req.body));

	lampON = req.body.lampstate;

	if (lampON) {
		res.send(200);
	} else {
		res.send(201);
	}	
	
});

app.get('/temperature', function (req, res) {
  
  var tempvalue = Math.random() * (37.5 - 25.8) + 25.8;

  var temperature = new Temperature(tempvalue,"11:30:90","21/10/2014"); 
  console.log("Send temperature");
  res.send(JSON.stringify(temperature));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
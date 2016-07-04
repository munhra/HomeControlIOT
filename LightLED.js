var Gpio = require("onoff").Gpio;
var led = new Gpio(18,"out");

var iv = setInterval(function(){

	led.writeSync(led.readSync() === 0 ? 1: 0)

}, 500);


setTimeout(function() {

	clearInterval(iv);
	led.writeSync(0);
	led.unexport();

},5000);

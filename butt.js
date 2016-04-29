var Gpio = require('onoff').Gpio;
var led = {
  'red': new Gpio(21, 'low'),
  'yellow': new Gpio(22, 'low'),
  'blue': new Gpio(10, 'low'),
  'green': new Gpio(9, 'low'),
  'white': new Gpio(11, 'low')
}
var button = {
  'red': new Gpio(1, 'in', 'both'), //GOOD
  'yellow': new Gpio(4, 'in', 'both'), //GOOD
  'blue': new Gpio(0, 'in', 'both'), //GOOD
  'green': new Gpio(8, 'in', 'both'), //GOOD
  'white': new Gpio(7, 'in', 'both'), //GOOD
}

var i = 0;
setInterval(function () {
  led.red.writeSync(i);
  led.yellow.writeSync(i);
  led.blue.writeSync(i);
  led.green.writeSync(i);
  led.white.writeSync(i);
  if (i == 1) {
    i = 0;
  } else {
    i = 1;
  }
  console.log("LEDS: " + i);
}, 1000)

function exit() {
  led.red.unexport();
  led.yellow.unexport();
  led.blue.unexport();
  led.green.unexport();
  led.white.unexport();

  button.red.unexport();
  button.yellow.unexport();
  button.blue.unexport();
  button.green.unexport();
  button.white.unexport();

  process.exit();
}

button.red.watch(function (err, value) {
  if (err) {throw err;}
  led.red.writeSync(value);
  console.log("Red: " + value);
});

button.yellow.watch(function (err, value) {
  if (err) {throw err;}
  led.yellow.writeSync(value);
  console.log("Yellow: " + value);
});

button.blue.watch(function (err, value) {
  if (err) {throw err;}
  led.blue.writeSync(value);
  console.log("Blue: " + value);
});

button.green.watch(function (err, value) {
  if (err) {throw err;}
  led.green.writeSync(value);
  console.log("Green: " + value);
});

button.white.watch(function (err, value) {
  if (err) {throw err;}
  led.white.writeSync(value);
  console.log("White: " + value);
});



process.on('SIGINT', exit);

console.log("Listening...");
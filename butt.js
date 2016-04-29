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

var isOn = {
  red: false,
  yellow: false,
  blue: false,
  green: false,
  white: false
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

  isOn.red = !isOn.red;
  var v = 0;
  if (isOn.red) v = 1;
  led.red.writeSync(v);

  outputTable();
});

button.yellow.watch(function (err, value) {
  if (err) {throw err;}
  isOn.yellow = !isOn.yellow;
  var v = 0;
  if (isOn.yellow) v = 1;
  led.yellow.writeSync(v);

  outputTable();
});

button.blue.watch(function (err, value) {
  if (err) {throw err;}
  isOn.blue = !isOn.blue;
  var v = 0;
  if (isOn.blue) v = 1;
  led.blue.writeSync(v);

  outputTable();
});

button.green.watch(function (err, value) {
  if (err) {throw err;}
  isOn.green = !isOn.green;
  var v = 0;
  if (isOn.green) v = 1;
  led.green.writeSync(v);

  outputTable();
});

button.white.watch(function (err, value) {
  if (err) {throw err;}
  isOn.white = !isOn.white;
  var v = 0;
  if (isOn.white) v = 1;
  led.white.writeSync(v);

  outputTable();
});

function outputTable() {
  console.log("Red: " + isOn.red + "Yellow: " + isOn.yellow + "Blue: " + isOn.blue + "Green: " + isOn.green + "White: " + isOn.white);
}

process.on('SIGINT', exit);

console.log("Listening...");
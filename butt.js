var Gpio = require('onoff').Gpio;
var led = {
  'red': new Gpio(9, 'low'),
  'yellow': new Gpio(11, 'low'),
  'blue': new Gpio(25, 'low'),
  'green': new Gpio(8, 'low'),
  'white': new Gpio(7, 'low')
}
var button = {
  'red': new Gpio(21, 'in', 'rising'),
  'yellow': new Gpio(17, 'in', 'rising'),
  'blue': new Gpio(23, 'in', 'rising'),
  'green': new Gpio(22, 'in', 'rising'),
  'white': new Gpio(24, 'in', 'rising'),
}

// led.red.writeSync(1);
// led.yellow.writeSync(1);
// led.blue.writeSync(1);
// led.green.writeSync(1);
// led.white.writeSync(1);

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
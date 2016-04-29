var Gpio = require('onoff').Gpio;
var led = {
  'red': new Gpio(30, 'low'),
  'yellow': new Gpio(31, 'low'),
  'blue': new Gpio(32, 'low'),
  'green': new Gpio(33, 'low'),
  'white': new Gpio(34, 'low')
}
var button = {
  'red': new Gpio(1, 'in', 'both'),
  'yellow': new Gpio(4, 'in', 'both'),
  'blue': new Gpio(0, 'in', 'both'),
  'green': new Gpio(8, 'in', 'both'), //GOOD
  'white': new Gpio(7, 'in', 'both'), //GOOD
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
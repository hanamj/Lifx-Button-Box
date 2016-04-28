var Gpio = require('onoff').Gpio;
var led = {
  'red': new Gpio(9, 'out'),
  'yellow': new Gpio(11, 'out'),
  'blue': new Gpio(25, 'out'),
  'green': new Gpio(8, 'out'),
  'white': new Gpio(7, 'out')
}
var button = {
  'red': new Gpio(4, 'in', 'both'),
  'yellow': new Gpio(17, 'in', 'both'),
  'blue': new Gpio(14, 'in', 'both'),
  'green': new Gpio(15, 'in', 'both'),
  'white': new Gpio(18, 'in', 'both'),
}

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
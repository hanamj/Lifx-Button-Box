var Gpio = require('onoff').Gpio;
var led = {
  'red': new Gpio(21, 'low'),
  'yellow': new Gpio(22, 'low'),
  'blue': new Gpio(10, 'low'),
  'green': new Gpio(9, 'low'),
  'white': new Gpio(11, 'low')
}
var button = {
  'red': new Gpio(1, 'in', 'rising'), //GOOD
  'yellow': new Gpio(4, 'in', 'rising'), //GOOD
  'blue': new Gpio(0, 'in', 'rising'), //GOOD
  'green': new Gpio(8, 'in', 'rising'), //GOOD
  'white': new Gpio(7, 'in', 'rising'), //GOOD
}

var t = {
  red: 0,
  yellow: 0,
  blue: 0,
  green: 0,
  white: 0
}

var isOn = {
  red: false,
  yellow: false,
  blue: false,
  green: false,
  white: false
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

function init() {
  led.red.writeSync(1);
  led.green.writeSync(1);
  led.blue.writeSync(1);
  led.yellow.writeSync(1);
  led.white.writeSync(1);

  console.log("Listening...");

  setTimeout(function () {
    led.red.writeSync(0);
    led.green.writeSync(0);
    led.blue.writeSync(0);
    led.yellow.writeSync(0);
    led.white.writeSync();
  }, 500)
}

button.red.watch(function (err, value) {
  if (err) {throw err;}
  if (value == 1) return;

  if ((Date.now() - t.red) < 200) return;
  t.red = Date.now();

  isOn.red = !isOn.red;
  var v = 0;
  if (isOn.red) v = 1;
  led.red.writeSync(v);

  outputTable();
});

button.yellow.watch(function (err, value) {
  if (err) {throw err;}
  if (value == 1) return;
  
  if ((Date.now() - t.yellow) < 200) return;
  t.yellow = Date.now();

  isOn.yellow = !isOn.yellow;
  var v = 0;
  if (isOn.yellow) v = 1;
  led.yellow.writeSync(v);

  outputTable();
});

button.blue.watch(function (err, value) {
  if (err) {throw err;}
  if (value == 1) return;
  
  if ((Date.now() - t.blue) < 200) return;
  t.blue = Date.now();

  isOn.blue = !isOn.blue;
  var v = 0;
  if (isOn.blue) v = 1;
  led.blue.writeSync(v);

  outputTable();
});

button.green.watch(function (err, value) {
  if (err) {throw err;}
  if (value == 1) return;
  
  if ((Date.now() - t.green) < 200) return;
  t.green = Date.now();

  isOn.green = !isOn.green;
  var v = 0;
  if (isOn.green) v = 1;
  led.green.writeSync(v);

  outputTable();
});

button.white.watch(function (err, value) {
  if (err) {throw err;}
  if (value == 1) return;
  
  if ((Date.now() - t.white) < 200) return;
  t.white = Date.now();
  
  isOn.white = !isOn.white;
  var v = 0;
  if (isOn.white) v = 1;
  led.white.writeSync(v);

  outputTable();
});

function outputTable() {
  console.log("R: " + (isOn.red ? 1 : 0) + "  Y: " + (isOn.yellow ? 1 : 0) + "  B: " + (isOn.blue ? 1 : 0) + "  G: " + (isOn.green ? 1 : 0) + "  W: " + (isOn.white ? 1 : 0));
}

process.on('SIGINT', exit);

init();


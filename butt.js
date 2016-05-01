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

var lastPressed = 0;

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
  buttonPressed('red', err, value);
});

button.yellow.watch(function (err, value) {
  buttonPressed('yellow', err, value);
});

button.blue.watch(function (err, value) {
  buttonPressed('blue', err, value);
});

button.green.watch(function (err, value) {
  buttonPressed('green', err, value);
});

button.white.watch(function (err, value) {
  buttonPressed('white', err, value);
});

function buttonPress(butt, err, value) {
  if (err) {throw err;}
  if (value == 1) return; //We only care when the button is first pushed, not when released

  if ((Date.now() - lastPressed) < 200) return;
  lastPressed = Date.now();

  isOn[butt] = !isOn[butt];

  led[butt].writeSync((isOn[butt] ? 1 : 0));

  outputTable();
}

function outputTable() {
  console.log("R: " + (isOn.red ? 1 : 0) + "  Y: " + (isOn.yellow ? 1 : 0) + "  B: " + (isOn.blue ? 1 : 0) + "  G: " + (isOn.green ? 1 : 0) + "  W: " + (isOn.white ? 1 : 0));
}

process.on('SIGINT', exit);

init();


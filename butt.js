// LIFX - c7798a45f018bf9940379697267bd88dadeb937fc4865e6952e1fc98688feb65
// "id": "d073d5001d7b",
// "uuid": "028dfd65-d2f0-4d7c-af9b-0b7c670d8786",

var Gpio = require('onoff').Gpio;
var Firebase = require("firebase");
var needle = require("needle");

var fb = new Firebase('https://lifxbuttons.firebaseio.com/')

var BRIGHTNESS = 0.2,
    DURATION = 0.5,
    ON = "on",
    OFF = "off";

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

  fb.child('status').set({red: false, green: false, blue: false, yellow: false, white: false})

  process.exit();
}

function init() {
  button.red.watch(function (err, value) {
    buttonPress('red', err, value);
  });

  button.yellow.watch(function (err, value) {
    buttonPress('yellow', err, value);
  });

  button.blue.watch(function (err, value) {
    buttonPress('blue', err, value);
  });

  button.green.watch(function (err, value) {
    buttonPress('green', err, value);
  });

  button.white.watch(function (err, value) {
    buttonPress('white', err, value);
  });

  fb.child('control').on("child_changed", function(snapshot) {
    b = snapshot.key()
    v = snapshot.val()
    if (v === true) buttonPress(b, null, 0)
    
    var update = {}
    update[b] = false
    fb.child('control').update(update)
  });

  console.log("Listening...");
  flashAll(500);
}

function flashAll(t) {
  led.red.writeSync(1);
  led.green.writeSync(1);
  led.blue.writeSync(1);
  led.yellow.writeSync(1);
  led.white.writeSync(1);

  setTimeout(function () {
    led.red.writeSync(0);
    led.green.writeSync(0);
    led.blue.writeSync(0);
    led.yellow.writeSync(0);
    led.white.writeSync();
  }, t)
}

function buttonPress(butt, err, value) {
  if (err) {throw err;}
  if (value == 1) return; //We only care when the button is first pushed, not when released

  if ((Date.now() - lastPressed) < 200) return;
  lastPressed = Date.now();

  isOn[butt] = !isOn[butt];

  led[butt].writeSync((isOn[butt] ? 1 : 0));

  updateFirebase();
  outputTable();

  toggle()
}

function outputTable() {
  console.log("R: " + (isOn.red ? 1 : 0) + "  Y: " + (isOn.yellow ? 1 : 0) + "  B: " + (isOn.blue ? 1 : 0) + "  G: " + (isOn.green ? 1 : 0) + "  W: " + (isOn.white ? 1 : 0));
}

function updateFirebase() {
  fb.child('status').set(isOn)
}

function toggle() {
  var options = {
    headers: { 'Authorization': 'Bearer c7798a45f018bf9940379697267bd88dadeb937fc4865e6952e1fc98688feb65',
                'content-length': '17' }
  }

  var c = Math.floor(Math.random()*16777215).toString(16);

  needle.put('https://api.lifx.com/v1/lights/d073d5001d7b/state', {color:"#000000", power: ON, brightness: BRIGHTNESS, duration: DURATION}, options, function(err, resp) {
    console.log(resp.results.status)
  });
}

process.on('SIGINT', exit);

init();


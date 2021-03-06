// LIFX - c7798a45f018bf9940379697267bd88dadeb937fc4865e6952e1fc98688feb65
// "id": "d073d5001d7b",
// "uuid": "028dfd65-d2f0-4d7c-af9b-0b7c670d8786",

var Gpio = require('onoff').Gpio;
var Firebase = require("firebase");
var needle = require("needle");

var fb = new Firebase('https://lifxbuttons.firebaseio.com/')

var BRIGHTNESS = 0.2,
    DURATION = 0.5,
    POWER = false;

var FLASHINTERVAL = [],
    FLASHSTATE = 1;

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
  turnOff();
  
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
    butt = snapshot.key()
    v = snapshot.val()

    if (v === true) buttonPress(butt, null, 0)

    var update = {};
    update[butt] = false;
    fb.child('control').update(update);
  });

  console.log("Turning on...");

  //Turn on Red to start us off
  setTimeout(function () {
    turnOn();
  }, 1000)

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
    led.white.writeSync(0);
  }, t)
}

function buttonPress(butt, err, value) {
  if (err) {throw err;}
  if (value == 1) return; //We only care when the button is first pushed, not when released

  if ((Date.now() - lastPressed) < 200) return;
  lastPressed = Date.now();

  //Don't do anything if "power" is off, unless it's the power button, of course
  if ((butt !== "white") && (!POWER)) return;

  isOn[butt] = !isOn[butt];
  led[butt].writeSync((isOn[butt] ? 1 : 0));

  updateFirebase();
  
  if (butt === "white") {
    if (isOn.white) turnOn();
    if (!isOn.white) turnOff();
  } else {
    changeLight();
    outputTable();
  }
}

function outputTable() {
  console.log("R: " + (isOn.red ? 1 : 0) + "  Y: " + (isOn.yellow ? 1 : 0) + "  B: " + (isOn.blue ? 1 : 0) + "  G: " + (isOn.green ? 1 : 0) + "  W: " + (isOn.white ? 1 : 0) + "  Power: " + POWER);
}

function updateFirebase() {
  fb.child('status').set(isOn)
}

function changeLight() {
  var c = calculateColor();
  if ((c.r == 0) && (c.g == 0) && (c.b == 0)) {
    b = 0.03
  } else {
    b = BRIGHTNESS
  }

  var options = {
    headers: { 'Authorization': 'Bearer c7798a45f018bf9940379697267bd88dadeb937fc4865e6952e1fc98688feb65',
                'content-length': '17' }
  }

  console.log("Sending Lifx request...")
  startFlash()
  needle.put('https://api.lifx.com/v1/lights/d073d5001d7b/state', {color:"rgb:" + c.r + "," + c.g + "," + c.b, power: (POWER ? "on" : "off"), brightness: b, duration: DURATION}, options, function(err, resp) {
    //console.log(resp.body.results.status)
    console.log("Lifx response received.")
    stopFlash()
  });
}

function calculateColor() {
  var r = 0;
  var g = 0;
  var b = 0;

  if (isOn.red) r = 255;
  if (isOn.green) g = 255;
  if (isOn.blue) b = 255;
  
  if (isOn.yellow) {
    if (isOn.blue) {
      b = 180
    } else {
      b = 106
    }
    r = 255
    g = 255
  }

  return {r:r, g:g, b:b};
}

function turnOn() {
  ['red', 'green', 'blue', 'white'].forEach(function (v) {
    isOn[v] = true;
    led[v].writeSync(1); 
  })
  POWER = true

  updateFirebase();
  outputTable();

  changeLight()
}

function turnOff() {
  ['red', 'green', 'blue', 'white'].forEach(function (v) {
    isOn[v] = false
    led[v].writeSync(0)
  })
  POWER = false

  updateFirebase();
  outputTable();

  changeLight()
}

function startFlash() {
  var fi = setInterval(function () {
    led['white'].writeSync(FLASHSTATE);
    if (FLASHSTATE == 1) {
      FLASHSTATE = 0;
    } else {
      FLASHSTATE = 1;
    }
  }, 250);

  FLASHINTERVAL.push(fi)
}

function stopFlash() {
  FLASHINTERVAL.forEach(function (v) {
    clearInterval(v)
  })
  led['white'].writeSync((isOn.white ? 1 : 0));
}
process.on('SIGINT', exit);

init()



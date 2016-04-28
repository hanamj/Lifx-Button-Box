var Gpio = require('onoff').Gpio,
  led = new Gpio(14, 'out'),
  led2 = new Gpio(15, 'out'),
  button = new Gpio(4, 'in', 'both');
 
function exit() {
  led.unexport();
  led2.unexport();
  button.unexport();
  process.exit();
}
 
led.writeSync(1);
led2.writeSync(1);

button.watch(function (err, value) {
  if (err) {
    throw err;
  }
 
  led.writeSync(value);
  console.log(value);
});
 
process.on('SIGINT', exit);

var express = require('express');
var mqtt = require ('mqtt');
var temp_ws = 0;
var temp_alex = 0;

var client  = mqtt.connect('mqtt://52.28.188.180:1883');

client.on('connect', function () {
  client.subscribe('temp_ws');
  client.subscribe('temp_home');
});
client.on('message', function (topic, message) {
  console.log(topic, 'temperature is :', message.toString());
  if (topic == "temp_home") {
    temp_alex = message.toString();
  } else {
    temp_ws = message.toString();
  }
});

var app = express();
var counter = 0;

app.get('/api/increment', function (req, res) {
  counter ++;
  res.status(200).send(counter.toString());
});
app.get('/api/get-temp', function (req, res) {
  res.status(200).send(temp_ws);
});
app.get('/api/alexs-home-temp', function (req, res) {
  res.status(200).send(temp_alex);
});
app.get ('/api/change-led', function (req, res) {
  // r=1
  var led = req.query.led[0];
  var state = req.query.state == "true" ? 1: 0;
  var pub = led + '=' + state;
  console.log ('publishing ' + pub);
  client.publish('leds', pub);
  res.send('ok');
});

app.use(express.static('public'));

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Tooootally production app listening at http://%s:%s', host, port);
});

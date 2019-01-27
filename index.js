var express = require('express');
var app = express();
const path = require('path');
const router = express.Router();
var bodyParser = require('body-parser');

app.use('/', router);
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/frontend/index.html'));
});

app.post('/endpoint', function (req, res) {
  var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send({ ola: "56"});
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

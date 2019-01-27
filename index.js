var express = require('express');
var app = express();
const path = require('path');
const router = express.Router();
var bodyParser = require('body-parser');
var http = require("http");

app.use('/', router);
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'/frontend/index.html'));
});

app.post('/endpoint', function (req, res) {
	var obj = {};
	request('http://apilayer.net/api/historical?access_key=&currencies=EUR,ARS,BRL&source=USD&format=1&date=').then(function(sucess){
		console.log(sucess);
		res.send(sucess);
	});
});

app.listen(3000, function () {
	console.log('Example app listening on port 3000!');
});

function request(hostname){
	return new Promise(function(resolve, reject) {
		var lastWeek = getDateLastWeek();
		console.log(lastWeek);
		var requestsDone = 0;
		var results = [];
		lastWeek.forEach(function(day){
			var req = http.request(hostname + day, function(res) {
				res.on('data', function (chunk) {
					requestsDone++;
					results.push(chunk);
					if(requestsDone == lastWeek.length){
						resolve(results);
					}
				});
			});
			req.on('error', function (error) {
				reject(error);
			});
			req.end();
		});
	});
}

function getDateLastWeek(){
	var dateToday = new Date();
	var lastDays = [];
	for(var day = 0; 1 < 7; day++){
		dateToday.setDate(dateToday.getDate() - day);
		lastDays.push(`${dateToday.getFullYear()}-${dateToday.getMonth() + 1}-${dateToday.getDate()}`);
	}
	return lastDays();
}
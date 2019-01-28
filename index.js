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
	request('http://apilayer.net/api/historical?access_key=&currencies=EUR,ARS,BRL&source=USD&format=1&date=').then(function(result){
		res.send(getJsonFormatted(result, req.body.coin));
	});
});

app.listen(3000, function () {
	console.log('Server iniciado na porta 3000!');
});

function request(hostname){
	return new Promise(function(resolve, reject) {
		var lastWeek = getDateLastWeek();
		var requestsDone = 0;
		var results = [];
		lastWeek.forEach(function(day){
			var req = http.request(hostname + day, function(res) {
				res.setEncoding('utf8');
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
	var month = dateToday.getMonth() + 1;
	lastDays.push(`${dateToday.getFullYear()}-${month < 10 ? "0" + month : month}-${dateToday.getDate()}`);
	for(var day = 1; day < 2; day++){
		dateToday.setDate(dateToday.getDate() - 1);
		month = dateToday.getMonth() + 1;
		lastDays.push(`${dateToday.getFullYear()}-${month < 10 ? "0" + month : month}-${dateToday.getDate()}`);
	}
	return lastDays;
}

function convertCoins(data, coin){
	var convertedCoins = [];
	data.forEach(function(dataDay){
		var dataJson = JSON.parse(dataDay);
		if(coin != "USD"){
			dataJson.quotes[`USD${coin}`] = dataJson.quotes.USDBRL / dataJson.quotes[`USD${coin}`];
		}
		convertedCoins.push(dataJson);
	});
	return convertedCoins;
}

function orderDate(data){
	return data.sort(function(dataA, dataB){
		return dataA.date - dataB.date;
	});
}

function sliceDataPerCoin(data, coin){
	var dataCoin = [];
	data.forEach(function(dataDay){
		dataCoin.push([dataDay.date, dataDay.quotes[`USD${coin}`]]);
	});
	return  dataCoin;
}

function getJsonFormatted(data, coin){
	var coinsPerDay = convertCoins(data, coin);
	coin = coin == "USD" ? "BRL" : coin;
	coinsPerDay = orderDate(coinsPerDay);
	return sliceDataPerCoin(coinsPerDay, coin);
}
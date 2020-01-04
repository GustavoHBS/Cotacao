var express = require('express');
var server = express();
const path = require('path');
const router = express.Router();
var bodyParser = require('body-parser');
var http = require("http");
const API_URL = `http://apilayer.net/api/historical?access_key=${process.env.API_LAYER_KEY}&currencies=EUR,ARS,BRL&source=USD&format=1&date=`;

server.use('/', router);
console.log(__dirname)
server.use(express.static(path.join(__dirname, '../frontend')));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/', function (req, res) {
	res.sendFile(path.join(__dirname+'../frontend/index.html'));
});

server.post('/endpoint', function (req, res) {
	requestHistoricalValue(API_URL).then(function(result){
		res.send(getJsonFormatted(result, req.body.coin));
	});
});

function requestHistoricalValue(url){
	return new Promise(function(resolve, reject) {
		var lastWeek = getDateLastWeek();
		var requestsDone = 0;
		var results = [];
		lastWeek.forEach(function(day){
			var req = http.request(url + day, function(res) {
				res.setEncoding('utf8');
				res.on('data', function (resultRequest) {
					requestsDone++;
					results.push(resultRequest);
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
	lastDays.push(getDateFormatted(dateToday));
	for(var day = 1; day < 7; day++){
		dateToday.setDate(dateToday.getDate() - 1);
		lastDays.push(getDateFormatted(dateToday));
	}
	return lastDays;
}

function getDateFormatted(date){
	var month = date.getMonth() + 1;
	let day = date.getDate();
	return `${date.getFullYear()}-${formatLenghtOfDate(month)}-${formatLenghtOfDate(day)}`;
}

function formatLenghtOfDate(date){
	return date.toString().length == 2 ? date : "0" + date;
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
		var dateA = dataA.date.replace(/-/g, "");
		var dateB = dataB.date.replace(/-/g, "");
		return dateA - dateB;
	});
}

function getDatesAndValuesOfCoin(data, coin){
	var dataCoin = {
		dates: [],
		valores: []
	};
	data.forEach(function(dataDay){
		dataCoin.dates.push(formatDateToBr(dataDay.date));
		dataCoin.valores.push(dataDay.quotes[`USD${coin}`]);
	});
	return  dataCoin;
}

function formatDateToBr(date){
	return `${date.slice(8)}/${date.slice(5,7)}/${date.slice(0, 4)}`;
}

function getJsonFormatted(data, coin){
	var coinsPerDay = convertCoins(data, coin);
	coin = coin == "USD" ? "BRL" : coin;
	coinsPerDay = orderDate(coinsPerDay);
	return getDatesAndValuesOfCoin(coinsPerDay, coin);
}

server.start = (port) => {
	server.listen(port, function () {
		console.log(`Server iniciado na porta ${port}!`);
	});
}

module.exports = {
	server
};
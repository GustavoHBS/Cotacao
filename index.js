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
	requestHistoricalValue(CHAVE_API).then(function(result){
		res.send(getJsonFormatted(result, req.body.coin));
	});
});

app.listen(3000, function () {
	console.log('Server iniciado na porta 3000!');
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
	return `${date.getFullYear()}-${month < 10 ? "0" + month : month}-${date.getDate()}`;
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

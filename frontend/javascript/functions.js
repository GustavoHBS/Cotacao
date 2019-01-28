const COINS = { 
	ARS: "Peso Argentino",
	USD: "Dollar",
	EUR: "Euro"
};

function loadGraph(coin, data){
	console.log(coin, data);
	Highcharts.chart('graph', {
		chart: {
			backgroundColor: {
				linearGradient: [0],
				stops: [
					[0, 'rgb(61, 61, 61)']
				]
			},
			zoomType: 'x'
		},
		title: {
			style: {
				color: "white"
			},
			text: `Conversão de Real para ${COINS[coin]}`
		},
		subtitle: {
			style: {
				color: "white"
			},
			text: "Dados dos ultimos 7 dias"
		},
		xAxis: {
			type: 'datetime',
			style: {
				color: "white"
			},
			labels: {
				style: {
					color: 'white'
				}
			}
		},
		yAxis: {
			title: {
				text: 'Valor',
				style: {
					color: "white"
				},
			},
			labels: {
				style: {
					color: 'white'
				}
			}
		},
		legend: {
			enabled: false
		},
		plotOptions: {
			area: {
				fillColor: {
				linearGradient: {
					x1: 0,
					y1: 0,
					x2: 0,
					y2: 1
				},
				stops: [
					[0, 'rgb(255, 255, 255)'],
					[1, 'rgb(0, 0, 0)']
				]
			},
			marker: {
				radius: 2
			},
			lineWidth: 1,
			states: {
				hover: {
					lineWidth: 1
				}
			},
			threshold: null
			},
			series: {
				color: '#e47707'
			}
		},	
		series: [{
			type: 'area',
			name: `${coin}`,
			data: data
		}]
	});
}

$(".buttonCoin").on("click", function(){
	var coin = $(this).prop("id");
	$.ajax({
		type: 'POST',
		data: { coin: coin},
		url: 'http://localhost:3000/endpoint',
		success: function(data) {
			console.log(data);
			loadGraph(coin, data);
		}
	});
});

$("#USD").trigger("click");
const COINS = { 
	ARS: "Peso Argentino",
	USD: "Dollar",
	EUR: "Euro"
};

function loadGraph(coin, data){
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
			text: `Conversão de ${COINS[coin]}(${coin}) para Real(BRL)`
		},
		subtitle: {
			style: {
				color: "white"
			},
			text: `Valor de 1 ${coin} em BRL`
		},
		xAxis: {
			categories: data.dates,
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
				text: "Valor em BRL",
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
						[0, 'rgb(255, 255, 255)']
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
			name: `${coin}`,
			data: data.valores
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
			loadGraph(coin, data);
		}
	});
});

$("#USD").trigger("click");
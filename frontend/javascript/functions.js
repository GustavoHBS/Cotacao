function loadGraph(coin = "Dollar"){
	//$("#graph").remove();
	$.getJSON(
		'https://cdn.rawgit.com/highcharts/highcharts/057b672172ccc6c08fe7dbb27fc17ebca3f5b770/samples/data/usdeur.json',
		function (data) {
	
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
				text: `Conversão de ${coin} para Real`
			},
			subtitle: {
				style: {
					color: "white"
				},
				text: document.ontouchstart === undefined ?
					'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
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
					text: 'Exchange rate',
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
	);
}
loadGraph();


$("#dollar").on("click", function(){
	var data = {};
	data.title = "title";
	data.message = "message";
	
	$.ajax({
		type: 'POST',
		data: data,
		url: 'http://localhost:3000/endpoint',
		success: function(data) {
			console.log('success');
			console.log(JSON.stringify(data));
		}
	});
});
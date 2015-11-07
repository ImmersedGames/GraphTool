document.addEventListener('DOMContentLoaded', function() {
    var xhr = new XMLHttpRequest();
	xhr.open('GET', encodeURI('data.json'));
	xhr.onload = function() {
		if (xhr.status === 200) {
			data = JSON.parse(xhr.responseText);
			console.log(data);
			
			data.forEach(function(graphDataset, arrayIndex){
				console.log("Found new graph");
				if(graphDataset && graphDataset.data){
					console.log(graphDataset);
					document.getElementById('graph-container').insertAdjacentHTML('beforeEnd', '<div id="graph-'+arrayIndex+'" class="graph-div"></div>');
					
					newChart = new CanvasJS.Chart("graph-"+arrayIndex,graphDataset);
					
					newChart.render();
				}
				else{
					console.log("Graph was null")
				}
			});
			
		}
	};
	xhr.send();

});
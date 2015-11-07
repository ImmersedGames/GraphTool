var listenPort = 1337;

var	http = require('http'),
	url = require('url'),
	fs = require('fs'),
	sqlite3 = require('sqlite3').verbose();
	
var db = null;

var app = http.createServer(function(request, response){
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");
	
	if(pathname == "/"){
		response.writeHead(200);
		
		html = fs.readFileSync("index.html", "utf8");
		response.write(html);
		response.end();
	}
	else if(pathname == "/canvasjs.min.js"){
		response.writeHead(200);
		
		script = fs.readFileSync("canvasjs.min.js","utf8");
		response.write(script);
		response.end();
	}
	else if(pathname == "/canvasjs.js"){
		response.writeHead(200);
		
		script = fs.readFileSync("canvasjs.js","utf8");
		response.write(script);
		response.end();
	}
	else if(pathname == "/drawgraphs.js"){
		response.writeHead(200);
		
		script = fs.readFileSync("drawgraphs.js","utf8");
		response.write(script);
		response.end();
	}
	else if(pathname == "/data.json"){
		db = new sqlite3.Database("StableTytoDome.db");
		
		response.writeHead(200, {'Content-Type':'application/json'});
		
		this.data = [{},{}];
		var data1 = {};
		//this.species = [];
		
		graphManager.OnComplete = function(){
			response.write(JSON.stringify(this.data,null,2));
			response.end();
			
			db.close();
			db = null;
		}.bind(this);
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, AVG(AverageHungerPercent) AS AverageHunger, AVG(AverageHealthPercent) AS AverageHealth, SUM(Population) AS TotalPopulation FROM Territory_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 0");
				
				this.data[0] = {
					data: [],
					title: {text: "Average Hunger"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Hunger Percentage"
					},
				};
				
				this.species0 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species0.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species0.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId,
						legendText: "Species " + row.SpeciesId,
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[0].data.push(newDataset);
				}
				
				dataIndex = this.species0.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.AverageHunger
				};
				
				
				if(this.data[0].data[dataIndex] != null && 'dataPoints' in this.data[0].data[dataIndex]){
					this.data[0].data[dataIndex].dataPoints.push(newDataPoint);
				}
				else{
					console.log("[ERROR] Data array at index " + dataIndex + " is null!");
				}
			}.bind(this),
			
			function(){}
		);
		
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, AVG(AverageHungerPercent) AS AverageHunger, AVG(AverageHealthPercent) AS AverageHealth, SUM(Population) AS TotalPopulation FROM Territory_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 1");
				
				this.data[1] = {
					data: [],
					title: {text: "Average Health"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Health Percentage"
					},
				};
				
				this.species1 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species1.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species1.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId,
						legendText: "Species " + row.SpeciesId,
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[1].data.push(newDataset);
				}
				
				dataIndex = this.species1.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.AverageHealth
				};
			
				
				if(this.data[1].data[dataIndex] != null && 'dataPoints' in this.data[1].data[dataIndex]){
					this.data[1].data[dataIndex].dataPoints.push(newDataPoint);
				}
				else{
					console.log("[ERROR] Data array at index " + dataIndex + " is null!");
				}
			}.bind(this),
			
			function(){}
		);
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, AVG(AverageHungerPercent) AS AverageHunger, AVG(AverageHealthPercent) AS AverageHealth, SUM(Population) AS TotalPopulation FROM Territory_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 2");
				
				this.data[2] = {
					data: [],
					title: {text: "Total Animal Population"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Population"
					},
				};
				
				
				this.species2 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species2.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species2.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId,
						legendText: "Species " + row.SpeciesId,
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[2].data.push(newDataset);
				}
				
				dataIndex = this.species2.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.TotalPopulation
				};
				
				
				if(this.data[2].data[dataIndex] != null && 'dataPoints' in this.data[2].data[dataIndex]){
					this.data[2].data[dataIndex].dataPoints.push(newDataPoint);
				}
				else{
					console.log("[ERROR] Data array at index " + dataIndex + " is null!");
				}
			}.bind(this),
			
			function(){}
		);
		
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, SUM(PlantsEaten) AS PlantsEaten, SUM(AnimalsEaten) AS AnimalsEaten FROM Territory_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 3");
				
				this.data[3] = {
					data: [],
					title: {text: "Eating Habits"},
					axisX: {
						title: "Day"
					},
					axisY: {
						titleFontSize: 13,
						title: "Cumulative # eaten by LIVING territories"
					},
				};
				
				this.species3 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species3.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species3.push(row.SpeciesId);
					newDataset1 = {
						type: "line",
						name: row.SpeciesId + " plants",
						legendText: "Species " + row.SpeciesId + " plants",
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[3].data.push(newDataset1);
					
					newDataset2 = {
						type: "line",
						name: row.SpeciesId + " animals",
						legendText: "Species " + row.SpeciesId + " animals",
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[3].data.push(newDataset2);
				}
				
				dataIndex = this.species3.indexOf(row.SpeciesId);
				
				newDataPoint1 = {
					x: row.EntryDate,
					y: row.PlantsEaten
				};
				
				newDataPoint2 = {
					x: row.EntryDate,
					y: row.AnimalsEaten
				};
				
				
				this.data[3].data[2 * dataIndex].dataPoints.push(newDataPoint1);
				this.data[3].data[2 * dataIndex + 1].dataPoints.push(newDataPoint2);
			}.bind(this),
			
			function(){}
		);
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, COUNT(Id) AS Population, AVG(LeafQuantity) AS LeafCount, AVG(Health) AS AverageHealth FROM Plant_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 4");
				
				this.data[4] = {
					data: [],
					title: {text: "Plant Population"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Population"
					},
				};
				
				this.species4 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species4.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species4.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId + " plants",
						legendText: "species " + row.SpeciesId + " population",
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[4].data.push(newDataset);
					
				}
				
				dataIndex = this.species4.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.Population
				};
				
				
				this.data[4].data[dataIndex].dataPoints.push(newDataPoint);
			}.bind(this),
			
			function(){}
		);
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, COUNT(Id) AS Population, AVG(LeafQuantity) AS LeafCount, AVG(Health) AS AverageHealth FROM Plant_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 5");
				
				this.data[5] = {
					data: [],
					title: {text: "Plant Average Health"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Health Percentage"
					},
				};
				
				this.species5 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species5.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species5.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId + " plants",
						legendText: "species " + row.SpeciesId + " health",
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[5].data.push(newDataset);
					
				}
				
				dataIndex = this.species5.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.AverageHealth
				};
				
				
				this.data[5].data[dataIndex].dataPoints.push(newDataPoint);
			}.bind(this),
			
			function(){}
		);
		
		graphManager.RegisterGraph("SELECT EntryDate, SpeciesId AS SpeciesId, COUNT(Id) AS Population, AVG(LeafQuantity) AS LeafCount, SUM(LeafQuantity) AS TotalLeafs, AVG(Health) AS AverageHealth FROM Plant_Statistics GROUP BY EntryDate, SpeciesId ORDER BY SpeciesId ASC",
			function(){
				console.log("Running init 6");
				
				this.data[6] = {
					data: [],
					title: {text: "Plant Leaf Count"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Quantity of Leaves in Biodome"
					},
				};
				
				this.species6 = [];
			}.bind(this),
			
			function(err, row){
				if(this.species6.indexOf(row.SpeciesId) == -1){
					console.log("Found new species id: " + row.SpeciesId);
					
					this.species6.push(row.SpeciesId);
					newDataset = {
						type: "line",
						name: row.SpeciesId + " plants",
						legendText: "species " + row.SpeciesId + " leaf count",
						showInLegend: true,
						dataPoints: []
					};
					
					this.data[6].data.push(newDataset);
					
				}
				
				dataIndex = this.species6.indexOf(row.SpeciesId);
				
				newDataPoint = {
					x: row.EntryDate,
					y: row.TotalLeafs
				};
				
				
				this.data[6].data[dataIndex].dataPoints.push(newDataPoint);
			}.bind(this),
			
			function(){}
		);
		
		graphManager.RegisterGraph("SELECT EntryDate, Detritus AS DetritusValue FROM BP_GameManager_C_Statistics GROUP BY EntryDate, Id ORDER BY Id ASC",
			function(){
				console.log("Running init 7");
				
				this.data[7] = {
					data: [],
					title: {text: "Section 1 Detritus"},
					axisX: {
						title: "Day"
					},
					axisY: {
						title: "Detritus Value"
					},
				};
				
				newDataset = {
					type: "line",
					name: "section1detritus",
					legendText: "Section 1 Detritus",
					showInLegend: true,
					dataPoints: []
				};
				
				this.data[7].data.push(newDataset);
			
			}.bind(this),
			
			function(err, row){

				newDataPoint = {
					x: row.EntryDate,
					y: row.DetritusValue
				};
				
				
				this.data[7].data[0].dataPoints.push(newDataPoint);
			}.bind(this),
			
			function(){}
		);
		
		graphManager.Run();
		
	}
}).listen(listenPort);


var graphManager = {
	graphQueue: [],
	
	dataContainer: null,
	
	RegisterGraph: function(sqlQuery, initCallback, eachCallback, completeCallback){
		this.graphQueue.push({
			query: sqlQuery,
			init: initCallback,
			each: eachCallback,
			complete: completeCallback,
			hasBegun: false
		})
	},
	
	OnComplete: function(){},

	
	Run: function(){
		self = this;
		self.block = false;
		for(x=0;x<self.graphQueue.length;x+=1){
			console.log("not blocked");
			self.counter += 1;
			graphQuery = self.graphQueue[x];
			
			console.log(graphQuery.query);
			db.each(graphQuery.query, function(index, err, row){
				if(this.graphQueue[index].hasBegun == false){
					this.graphQueue[index].hasBegun = true;
					(this.graphQueue[index].init)();
				}
				
				(this.graphQueue[index].each)(err, row);
			}.bind(this,x), 
			
			function(index){
				
				this.counter -= 1;
				
				console.log("Complete!");
				
				(this.graphQueue[index].complete)();
				
				if(this.counter == 0){
					this.OnComplete();
					
					this.graphQueue = [];
				}
			}.bind(this,x));
		}
		
		if(self.counter == 0){
			self.OnComplete();
		}
	},
	
	block: false,
	
	counter: 0
}

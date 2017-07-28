//Width and height of map
var width = 1440;
var height = 810;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])	// translate to center of screen
				   .scale(1800);		  // scale things down so see entire US
		
// Define path generator
var path = d3.geoPath()			   // path generator that will convert GeoJSON to SVG paths
			 .projection(projection);  // tell path generator to use albersUsa projection


//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);

// Load GeoJSON data and merge with states data
d3.json("us-states.json", function(json) {
		
	// Bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.style("fill", "rgb(213,222,217)");


	d3.json("https://api.airtable.com/v0/appLP8buaFL1bs93b/Events?api_key=key4RAnp5ZN85bSlE", function(data) {
		svg.selectAll("circle")
			.data(data.records)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("cx", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[1];
			})
			.attr("r", function(d) {
				return 16;
			})
			.on("mouseover", function(d) {
				d3.select("#name").text(d.fields.Name);
				d3.select("#place").text(d.fields.City + ", " + d.fields.State);
				d3.select("#date").text(d.fields.Start + " - " + d.fields.End);
				d3.select("#description").text(d.fields.Description);
				d3.select("#website").text(d.fields.Website);
				d3.select("#info").style("visibility", "initial");
			})

	});
});
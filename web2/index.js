//Width and height of map
var width = 1600;
var height = 900;

// D3 Projection
var projection = d3.geoAlbersUsa()
				   .translate([width/2, height/2])    // translate to center of screen
				   .scale(2000);          // scale things down so see entire US
        
// Define path generator
var path = d3.geoPath()               // path generator that will convert GeoJSON to SVG paths
			 .projection(projection);  // tell path generator to use albersUsa projection


//Create SVG element and append map to the SVG
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
        
// Append Div for tooltip to SVG
var div = d3.select("body")
		    .append("div")   
    		.attr("class", "tooltip")               
    		.style("opacity", 0);

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
			.attr("cx", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[1];
			})
			.attr("r", function(d) {
				return 6 * 4;
			})
				.style("fill", "rgb(217,91,67)")	
				.style("opacity", 0.85);
		});
});
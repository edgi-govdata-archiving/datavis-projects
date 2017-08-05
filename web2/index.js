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
	
	var repeat = {};
	// Bind the data to the SVG and create one path per GeoJSON feature
	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.style("fill", "rgb(213,222,217)");


	d3.json("http://edgi-airtable-url-proxy.herokuapp.com/", function(data) {
		svg.selectAll("circle")
			.data(data.records)
			.enter()
			.append("circle")
			.attr("class", function(d){
				if(repeat[d.fields.City + d.fields["State/Province"]] == null){
					repeat[d.fields.City + d.fields["State/Province"]] = 1;
				} else {
					repeat[d.fields.City + d.fields["State/Province"]]++;
				}
				return "circle";
			})
			.attr("cx", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[1];
			})
			.attr("r", function(d) {
				return 12;
			})
			.on("mouseover", function(d) {
				if(repeat[d.fields.City + d.fields["State/Province"]] > 1){

				} else {
					d3.select("#name").text(d.fields.Name);
					d3.select("#place").text(d.fields.City + ", " + d.fields["State/Province"]);
					var date1 = d.fields["Start Date/Time"].substring(0,10), date2 = d.fields["End Date/Time"].substring(0, 10);
					if(date1 == date2){ d3.select("#date").text(date1); } 
					else { d3.select("#date").text(date1 + " - " + date2); } 
					var val = d.fields.Description.replace(/\n/g, "<br />");
					d3.select("#description").html(val);
					d3.select("#website").html("<a href=\"" + d.fields.Website + "\" target=\"_blank\" >" + d.fields.Website + "</a>" );
					d3.select("#info").style("visibility", "initial");
				}
			})

	});
});
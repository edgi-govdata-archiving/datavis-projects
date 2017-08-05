//Width and height of map
var width = 1170;
var height = 658;

// D3 Projection
var projection = d3.geoAlbersUsa()
					.translate([width/2, height/2])
					.scale(1462);
		
// Define path generator
var path = d3.geoPath()
			.projection(projection);

//Create SVG element and append map to the SVG
var svg = d3.select("#map")
			.append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("viewBox", "0 0 " + width + " " + height)
			.attr("preserveAspectRatio", "xMidYMid meet");

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
			.attr("class", "circle")
			.attr("cx", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.fields.Longitude, d.fields.Latitude])[1];
			})
			.attr("r", function(d) {
				if(repeat[d.fields.City + d.fields["State/Province"]] == null){
					repeat[d.fields.City + d.fields["State/Province"]] = 1;
					return 12;
				} else {
					repeat[d.fields.City + d.fields["State/Province"]]++;
					return 12;
				}
			})
			.on("mouseover", function(d) {
				if(repeat[d.fields.City + d.fields["State/Province"]] > 1){
					d3.select("#map_title").text(d.fields.Name);
					d3.select("#map_location").text(d.fields.City + ", " + d.fields["State/Province"]);
					if(d.fields["Est. Attendees"] == null){
						d3.select("#map_attendees").text("Est. Attendees: N/A");
					} else { d3.select("#map_attendees").text("Est. Attendees: " + d.fields["Est. Attendees"]); }

					var date1 = d.fields["Start Date/Time"].substring(0,10).replace(/-/g, "/"), date2 = d.fields["End Date/Time"].substring(0, 10).replace(/-/g, "/");
					if(date1 == date2){ d3.select("#map_date").text(date1); } 
					else { d3.select("#map_date").text(date1 + " - " + date2); } 

					var val = d.fields.Description.replace(/\n/g, "<br />");
					d3.select("#map_description").html(val);

					d3.select("#map_website").html("<a href=\"" + d.fields.Website + "\" target=\"_blank\" >Website</a>" );
				} else {
					d3.select("#map_title").text(d.fields.Name);
					d3.select("#map_location").text(d.fields.City + ", " + d.fields["State/Province"]);
					if(d.fields["Est. Attendees"] == null){
						d3.select("#map_attendees").text("Est. Attendees: N/A");
					} else { d3.select("#map_attendees").text("Est. Attendees: " + d.fields["Est. Attendees"]); }

					var date1 = d.fields["Start Date/Time"].substring(0,10).replace(/-/g, "/"), date2 = d.fields["End Date/Time"].substring(0, 10).replace(/-/g, "/");
					if(date1 == date2){ d3.select("#map_date").text(date1); } 
					else { d3.select("#map_date").text(date1 + " - " + date2); } 

					var val = d.fields.Description.replace(/\n/g, "<br />");
					d3.select("#map_description").html(val);

					d3.select("#map_website").html("<a href=\"" + d.fields.Website + "\" target=\"_blank\" >Website</a>" );
				}
			})

	});
});
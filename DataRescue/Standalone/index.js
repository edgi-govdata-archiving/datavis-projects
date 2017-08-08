//Width and height of map
var width = 1140;
var height = 641;

// D3 Projection
var projection = d3.geoAlbersUsa()
					.translate([width/2, height/2])
					.scale(1425);
		
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

d3.json("us-states.json", function(json){

	svg.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("stroke", "#fff")
		.style("stroke-width", "1")
		.style("fill", "rgb(213,222,217)");

	d3.json("http://edgi-airtable-url-proxy.herokuapp.com/", function(data){
		var byCity = d3.nest()
						.key(d => d.fields.City + ' ' + d.fields["State/Province"])
						.entries(data.records);

		svg.selectAll("shapes")
			.data(byCity)
			.enter()
			.append("circle")
			.attr("class", "circle")
			.attr("cx", function(d) {
				return projection([d.values[0].fields.Longitude, d.values[0].fields.Latitude])[0];
			})
			.attr("cy", function(d) {
				return projection([d.values[0].fields.Longitude, d.values[0].fields.Latitude])[1];
			})
			.attr("r", "16")
			.on("mouseover", function(d) {
				if(d.values.length > 1){
					d3.select("#map_info").html("").attr("class", "slider");

					for(var i = 0; i < d.values.length; i++){
						var date = d.values[i].fields["Start Date/Time"].substring(0,10), date1 = d.values[i].fields["End Date/Time"].substring(0, 10);
						if(date != date1){ date = date + " - " + date1 }

						var people = (d.values[i].fields["Est. Attendees"] == null) ? "Est. Attendees: N/A" : "Est. Attendees: " + d.values[i].fields["Est. Attendees"];

						var description = d.values[i].fields.Description.replace(/\n/g, "<br />");

						d3.select("#map_info").append("div").html(
							"<h1 class=\"title-post entry-title\">" + d.values[i].fields.Name + "</h1><h4>" + d.values[i].fields.City + ", " + d.values[i].fields["State/Province"] + "</h4><h4>" + date + "</h4><h4>" + people + "</h4><h4><a href=\"" + d.values[i].fields.Website + "\" target=\"_blank\">Website</a></h4><p>" + description + "</p>"
						);
					}

					$('.slider').slick({
						dots: true,
						fade: true,
						cssEase: 'linear',
						autoPlay: true,
						swipeToSlide: true,
						arrows: false

					});

				} else {
					var date = d.values[0].fields["Start Date/Time"].substring(0,10), date1 = d.values[0].fields["End Date/Time"].substring(0, 10);
					if(date != date1){ date = date + " - " + date1 }

					var people = (d.values[0].fields["Est. Attendees"] == null) ? "Est. Attendees: N/A" : "Est. Attendees: " + d.values[0].fields["Est. Attendees"];

					var description = d.values[0].fields.Description.replace(/\n/g, "<br />");

					d3.select("#map_info").attr("class", null).html(
						"<h1 class=\"title-post entry-title\">" + d.values[0].fields.Name + "</h1><h4>" + d.values[0].fields.City + ", " + d.values[0].fields["State/Province"] + "</h4><h4>" + date + "</h4><h4>" + people + "</h4><h4><a href=\"" + d.values[0].fields.Website + "\" target=\"_blank\">Website</a></h4><p>" + description + "</p>"
					);
				}
			})

	});
});
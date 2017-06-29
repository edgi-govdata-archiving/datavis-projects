// Dimensions of sunburst.
var width = 750;
var height = 600;
var radius = Math.min(width, height) / 2;

// Breadcrumb dimensions: width, height, spacing, width of tip/tail.
var b = {
	w: 75, h: 30, s: 3, t: 10
};

// Total size of all segments; we set this later, after loading the data.
var totalSize = 0;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var vis = d3.select("#chart").append("svg:svg")
		.attr("width", width)
		.attr("height", height)
		.append("svg:g")
		.attr("id", "container")
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var partition = d3.partition()
		.size([2 * Math.PI, radius * radius]);

var arc = d3.arc()
		.startAngle(function(d) { return d.x0; })
		.endAngle(function(d) { return d.x1; })
		.innerRadius(function(d) { return Math.sqrt(d.y0); })
		.outerRadius(function(d) { return Math.sqrt(d.y1); });

d3.json("coverage.json", function(error, root) {
	if (error) throw error;
	// Basic setup of page elements.
 /* initializeBreadcrumbTrail(); */

	// Bounding circle underneath the sunburst, to make it easier to detect
	// when the mouse leaves the parent g.
	vis.append("svg:circle")
			.attr("r", radius)
			.style("opacity", 0);

	totalSize = root.data.numLeaves;
	delete root.data.numLeaves;
	
	root = d3.hierarchy(root.data)
			.sum(function(d) { return d.numLeaves; })/*
			.sort(function(a, b) { return b.data.numLeaves - a.data.numLeaves; })*/; //used to be value.
	// For efficiency, filter nodes to keep only those large enough to see.
	var nodes = partition(root).descendants()
			.filter(function(d) {
				return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
			});

	var path = vis.data([root]).selectAll("path")
			.data(nodes)
			.enter().append("svg:path")
			.attr("display", function(d) { return d.depth ? null : "none"; })
			.attr("d", arc)
			.attr("fill-rule", "evenodd")
			.style("fill", function(d) { return color(d.depth); })
			.style("opacity", 1)
			.on("mouseover", mouseover)/*
			.each(stash)
				.transition()
				.duration(750)
				.attrTween("d", arcTween)*/;

	// Add the mouseleave handler to the bounding circle.
	d3.select("#container").on("mouseleave", mouseleave);
});

/*
function click(d)
{
	d3.select("#container").selectAll("path").remove();
	
	var nodes = partition.nodes(d)
			.filter(function(d) {
			return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
			}) ;
	
	var path = vis.data([d]).selectAll("path")
			.data(nodes)
			.enter().append("svg:path")
			.attr("display", function(d) { return d.depth ? null : "none"; })
			.attr("d", arc)
			.attr("fill-rule", "evenodd")
			.style("fill", function(d) { return colors[d.name]; })
			.style("opacity", 1)
			.on("mouseover", mouseover)
			.on("click", click)
			.each(stash)
				.transition()
				.duration(750)
				.attrTween("d", arcTween);
	;

	// Get total size of the tree = value of root node from partition.
	totalSize = path.node().__data__.value;
}
*/
// Fade all but the current sequence, and show it in the breadcrumb trail.
function mouseover(d) {
	// if the DEPTH is greater than one? //
	if(d.depth > 1){
		var percentage = (100 * d.data.numLeavesArchived / d.parent.data.numLeaves).toPrecision(3);
	} else {
		var percentage = (100 * d.data.numLeavesArchived / d.data.numLeaves).toPrecision(3);
	}

	var percentageString = percentage + "%";
	if (percentage < 0.1) {
		percentageString = "< 0.1%";
	}

	d3.select("#percentage")
			.text(percentageString);

	d3.select("#explanation")
			.style("visibility", "");

	d3.select("#website").text(d.data.name);

	var sequenceArray = d.ancestors().reverse();
	sequenceArray.shift();
	//updateBreadcrumbs(sequenceArray, percentageString);

	// Fade all the segments.
	d3.selectAll("path")
			.style("opacity", 0.3);

	// Then highlight only those that are an ancestor of the current segment.
	vis.selectAll("path")
			.filter(function(node) {
								return (sequenceArray.indexOf(node) >= 0);
							})
			.style("opacity", 1);
}

// Restore everything to full opacity when moving off the visualization.
function mouseleave(d) {

	// Hide the breadcrumb trail
	d3.select("#trail")
			.style("visibility", "hidden");

	// Deactivate all segments during transition.
	d3.selectAll("path").on("mouseover", null);

	// Transition each segment to full opacity and then reactivate it.
	d3.selectAll("path")
			.transition()
			.duration(500)
			.style("opacity", 1)
			.on("end", function() {
							d3.select(this).on("mouseover", mouseover);
						});

	d3.select("#explanation")
			.transition()
			.duration(1000)
			.style("visibility", "hidden");
}


/*
function initializeBreadcrumbTrail() {
	// Add the svg area.
	var trail = d3.select("#sequence").append("svg:svg")
			.attr("width", width)
			.attr("height", 50)
			.attr("id", "trail");
	// Add the label at the end, for the percentage.
	trail.append("svg:text")
		.attr("id", "endlabel")
		.style("fill", "#000");
}


// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
	var points = [];
	points.push("0,0");
	points.push(b.w + ",0");
	points.push(b.w + b.t + "," + (b.h / 2));
	points.push(b.w + "," + b.h);
	points.push("0," + b.h);
	if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
		points.push(b.t + "," + (b.h / 2));
	}
	return points.join(" ");
}
// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

	// Data join; key function combines name and depth (= position in sequence).
	var trail = d3.select("#trail")
			.selectAll("g")
			.data(nodeArray, function(d) { return d.data.name + d.depth; });

	// Remove exiting nodes.
	trail.exit().remove();

	// Add breadcrumb and label for entering nodes.
	var entering = trail.enter().append("svg:g");

	entering.append("svg:polygon")
			.attr("points", breadcrumbPoints)
			.style("fill", function(d) { return '#000'; });

	entering.append("svg:text")
			.attr("x", (b.w + b.t) / 2)
			.attr("y", b.h / 2)
			.attr("dy", "0.35em")
			.attr("text-anchor", "middle")
			.text(function(d) { return d.name; });

	// Set position for entering and updating nodes.
 entering.merge(trail).attr("transform", function(d, i) {
		return "translate(" + i * (b.w + b.s) + ", 0)";
	});

	// Now move and update the percentage at the end.
	d3.select("#trail").select("#endlabel")
			.attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
			.attr("y", b.h / 2)
			.attr("dy", "0.35em")
			.attr("text-anchor", "middle")
			.text(percentageString);

	// Make the breadcrumb trail visible, if it's hidden.
	d3.select("#trail")
			.style("visibility", "");

}*/

function arcTween(a){
  var i = d3.interpolate({x: a.x0, dx: a.x1}, a);
  return function(t) {
    var b = i(t);
    a.x0 = b.x0;
    a.x1 = b.x1;
    return arc(b);
  };
};
        
function stash(d) {
  d.x0 = 0; // d.x;
  d.x1 = 0; //d.dx;
};

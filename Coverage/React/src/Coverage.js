import React, { Component } from 'react'
import './Coverage.css'

import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'
import { rgb } from 'd3-color'

import { select } from 'd3-selection'

import { partition } from 'd3-hierarchy'
import { arc } from 'd3-shape'

import { json } from 'd3-request'

class Coverage extends Component {

//  var width = 750, height = 600, radius = Math.min(width, height) / 2;

  createColor(){
    return scaleLinear().interpolate(interpolateHcl())
    .domain([0.2, 0.4, 0.6, 0.8, 1])
    .range([rgb("#FF0000"), rgb("#FF7F00"), rgb("#FFFF00"), rgb("#7FFF00"), rgb("#00FF00")]);
  }

  createVis(){
    return select("#chart").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("svg:g")
      .attr("id", "container")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  }

  createPartition(){
    return partition.size([2 * Math.PI, radius * radius])
  }

  createArc(){
    return arc()
      .startAngle(function(d) { return d.x0; })
      .endAngle(function(d) { return d.x1; })
      .innerRadius(function(d) { return Math.sqrt(d.y0); })
      .outerRadius(function(d) { return Math.sqrt(d.y1); });
  }

  getJSON(file){
      json
  }

  render() { 
    return (
      <div id="#chart"> </div>
    );
  }
}

export default Coverage;

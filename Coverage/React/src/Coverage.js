import React, { Component } from 'react'
import './Coverage.css'

import { scaleLinear } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'
import { rgb } from 'd3-color'

import { select } from 'd3-selection'

import { hierarchy, partition } from 'd3-hierarchy'
import { arc } from 'd3-shape'


let file = require("./coverage.json")

const values = {
  width: 750,
  height: 600,
  radius: 300
} 

class Coverage extends Component {
  constructor(props){
    super(props);

    [
      'processData',
      'createPartition',
      'getColor',
      'getArc'
    ].forEach(m => this[m] = this[m].bind(this));
  }

  componentDidMount(){
  }
  
  componentDidUpdate(){
  }

  getColor(number){
    return scaleLinear().interpolate(interpolateHcl())
    .domain([0.2, 0.4, 0.6, 0.8, 1])
    .range([rgb("#FF0000"), rgb("#FF7F00"), rgb("#FFFF00"), rgb("#7FFF00"), rgb("#00FF00")]);
  }

  createPartition(file){
    return partition().size([2 * Math.PI, values.radius * values.radius])(file);
  }

  getArc(){
    return arc()
      .startAngle(function(d) { return d.x0; })
      .endAngle(function(d) { return d.x1; })
      .innerRadius(function(d) { return Math.sqrt(d.y0); })
      .outerRadius(function(d) { return Math.sqrt(d.y1); });
  }

  processData(){
    delete file.data.numLeaves;
    file = hierarchy(file.data).sum(function(d){ return d.numLeaves; });
    return this.createPartition(file).descendants()
      .filter(function(d) {
        return (d.x1 - d.x0 > 0.005); // 0.005 radians = 0.29 degrees
      });
  }

  render() {

              console.log(this.getColor(0.4))
    return (
      <div id="#chart">
        <svg width={values.width} height={values.height}>
          <g id="container" transform="translate(375, 300)">
            <circle r={values.radius} style={{opacity: 0}}></circle>
            {
              this.processData().map((x, i) => {
                return (<path fillRule="evenodd" key={i} style={{ fill: '#4fbba9' }} display={ x.depth ? null : "none" } d={ this.getArc()(x) } ></path>)
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default Coverage;

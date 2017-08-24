import React, { Component } from 'react'
import './Coverage.css'

import { scaleQuantile } from 'd3-scale'
import { interpolateHcl } from 'd3-interpolate'
import { rgb } from 'd3-color'

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

    this.state = {node: undefined};

    [
      'processData',
      'createPartition',
      'onMouseOver',
      'onMouseLeave',
      'calcPercent',
      'highlightArc',
      'getArc'
    ].forEach(m => this[m] = this[m].bind(this));
  }

  componentDidMount(){
  }
  
  componentDidUpdate(){
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
    return this.createPartition(file).descendants().filter(function(d) { return (d.x1 - d.x0 > 0.005); });
  }



  calcPercent(){
    let percent = (100 * this.state.node.data.numLeavesArchived / this.state.node.data.numLeaves).toPrecision(3);
    return percent < 0.1 ? "< 0.1%" : percent + "%";
  }

  onMouseOver(d){
    this.setState({node: d});
  }

  onMouseLeave(){
    this.setState({node: undefined});
  }

  highlightArc(d){
    if(this.state.node == undefined){
      return 1;
    } else {
      if(this.state.node.data === d.data){
        return 1;
      }
      let sequence = this.state.node.ancestors().reverse();
      sequence.shift();
      console.log(d)
      console.log(sequence)
      return (sequence.indexOf(d) >= 0) ? 1 : 0.3;
    }
  }

  render() {

    const color = scaleQuantile().domain([0, 1]).range([rgb('#fff7fb'),rgb('#ece2f0'),rgb('#d0d1e6'),rgb('#a6bddb'),rgb('#67a9cf'),rgb('#3690c0'),rgb('#02818a'),rgb('#016c59'),rgb('#014636')]);

    return (
      <div id="chart">

      { this.state.node == undefined ? "" : ( <div id="explanation">
          <span id="website" >{ this.state.node.data.name }</span><br />
          <span id="percentage">{ this.calcPercent() }</span><br/>has been archived
        </div> )
      }

        <svg width={values.width} height={values.height}>
          <g id="container" onMouseLeave={() => this.onMouseLeave()} transform="translate(375, 300)">
            {
              this.processData().map((x, i) => {
                return (<path fillRule="evenodd" key={i} style={{ fill: color(x.data.numLeavesArchived/x.data.numLeaves), stroke: "#fff", opacity: this.highlightArc(x) }} display={ x.depth ? null : "none" } d={ this.getArc()(x) } onMouseOver={() => this.onMouseOver(x)} ></path>)
              })
            }
          </g>
        </svg>
      </div>
    );
  }
}

export default Coverage;

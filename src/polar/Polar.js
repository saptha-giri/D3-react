import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import "./style.css";
import { max } from "lodash";

const Polar = (props) => {

    const mySvg = useRef(null);

    const draw = (data) =>{
        console.log("draw");
        console.log(data);
        var outerWidth = 960;
        var outerHeight = 600;
        var margin = { left: 11, top: 75, right: 377, bottom: 88 };
        // var radiusMax = 231;

        var xColumn = "name";

        var colorColumn = "label";
        var radiusColumn = "value";

        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;

        var radius = Math.min(innerWidth, innerHeight) / 2;

        var svg = d3.select(mySvg.current)
            .attr("width",  outerWidth)
            .attr("height", outerHeight);
        var g = svg.append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var xAxisG = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + innerHeight + ")");
        var pieG = g.append("g");

        let minVal = d3.min(data, d => d.value);
      let maxVal = d3.max(data, d => d.value);

      let ra = Math.max(Math.abs(minVal), Math.abs(maxVal))

      ra = ra + ((ra/100)*20);

        var xScale = d3.scalePoint().range([0, innerWidth]);
        var radiusScale = d3.scaleSqrt().range([0, radius]);
        var r = d3.scaleLinear().domain([0, ra]).range([0, radius]);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        var gr = pieG.append("g")
            .attr("class", "r axis")
          .selectAll("g")
          .data(r.ticks(5).slice(1))
          .enter().append("g");

          gr.append("circle")
          .attr("r", r);
          gr.append("text")
          .attr("y", function(d) { return -r(d) - 4; })
          // .attr("transform", "rotate(15)")
          .style("text-anchor", "middle")
          .text(function(d) { return d; });

        var xAxis = d3.axisBottom().scale(xScale).tickSize(10);

      var pie = d3.pie();
      var myarc = d3.arc();

      const tip = d3Tip().attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        return "<div><span style='background:"+d.data.color+"; color:"+d.data.color+"; display:inline-block; width: 1em;'>&nbsp;</span> <span>" + d.data.label +":"+ d.data.value + "</span></div>";
      })

        svg.call(tip);

        xScale.domain(data.map( function (d){ return d[xColumn]; }));
        radiusScale.domain([0, d3.max(data, function (d){ return d[radiusColumn]; })]);
        colorScale.domain(data.map(function (d){ return d[colorColumn]; }));

        pie.value(function (){ return 1; });

        var pieData = pie(data);
        myarc.innerRadius(0);
        myarc.outerRadius(function(d) { 
          return radiusScale(d.data[radiusColumn]/2);
        });

        var outerArc = d3.arc()
      .innerRadius(radius * 0.9)
      .outerRadius((radius/2) * 0.9)
          
        pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

        pieG.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("class","bar")
        .attr("d", myarc)
        .attr("fill",function (d){ return d.data.color; }).on('mouseover',tip.show)
        .attr("opacity",0.8)
        .on('mouseout', tip.hide).exit().remove();

        xAxisG.call(xAxis);

        pieG.append("line")
        .attr("x2", radius);

        pieG
          .selectAll('allLabels')
          .data(pieData)
          .enter()
          .append('text')
            .text( function(d) { console.log(d.data.label) ; return d.data.value } )
            .attr("transform", function(d) { return "translate(" + outerArc.centroid(d) + ")"; })
            .style('text-anchor', function(d) {
              var midangle = d.startAngle + (d.endAngle - d.startAngle) 
              return (midangle < Math.PI ? 'start' : 'end')
            })
            .attr("font-size","0.8em")
            .attr("fill",function (d){ return d.data.color; })
    }

    useEffect(() => {
        console.log("useEffect");
        const data = props.data;
        draw(data);
      });

    return <svg ref={mySvg}></svg>;
}

export default Polar;
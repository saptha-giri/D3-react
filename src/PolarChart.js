import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import d3Tip from "d3-tip";
import "./style.css";

const PolarChart = props =>{
    const mySvg = useRef(null);

    const renderPolar = () =>{
        var outerWidth = 960;
        var outerHeight = 500;
        var margin = { left: 11, top: 75, right: 377, bottom: 88 };
        var radiusMax = 231;
  
        var xColumn = "name";
  
        var colorColumn = "religion";
        var radiusColumn = "population";
  
        var innerWidth  = outerWidth  - margin.left - margin.right;
        var innerHeight = outerHeight - margin.top  - margin.bottom;
  
        var svg = d3.select("body").append("svg")
          .attr("width",  outerWidth)
          .attr("height", outerHeight);
        var g = svg.append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        var xAxisG = g.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + innerHeight + ")");
        var pieG = g.append("g");
  
        var colorLegendG = g.append("g")
          .attr("class", "color-legend")
          .attr("transform", "translate(595, -36)");
  
        var xScale = d3.scale.ordinal().rangePoints([0, innerWidth]);
        var radiusScale = d3.scale.sqrt().range([0, radiusMax]);
        var colorScale = d3.scale.category10();
  
        var xAxis = d3.svg.axis().scale(xScale).orient("bottom")
          .outerTickSize(0);
  
        var pie = d3.layout.pie();
        var arc = d3.svg.arc();
  
        var colorLegend = d3.legend.color()
          .scale(colorScale)
          .shapePadding(3)
          .shapeWidth(40)
          .shapeHeight(40)
          .labelOffset(4);
        const data = props.data;

        xScale.domain(data.map( function (d){ return d[xColumn]; }));
        radiusScale.domain([0, d3.max(data, function (d){ return d[radiusColumn]; })]);
        colorScale.domain(data.map(function (d){ return d[colorColumn]; }));

        pie.value(function (){ return 1; });
        arc.outerRadius(function(d) { 
          return radiusScale(d.data[radiusColumn]);
        });

        var pieData = pie(data);

        pieG.attr("transform", "translate(" + innerWidth / 2 + "," + innerHeight / 2 + ")");

        var slices = pieG.selectAll("path").data(pieData);
        slices.enter().append("path");
        slices
          .attr("d", arc)
          .attr("fill", function (d){ return colorScale(d.data[colorColumn]); });
        slices.exit().remove();

        xAxisG.call(xAxis);
        colorLegendG.call(colorLegend);
    }

    return (
        <svg ref={mySvg}></svg>
    );
}

export default PolarChart;
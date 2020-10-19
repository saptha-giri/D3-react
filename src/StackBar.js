import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./styles.css";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");

const XAxis = ({ top, bottom, left, right, height, scale }) => {
  const axis = useRef(null);

  useEffect(() => {
    d3.select(axis.current).call(d3.axisBottom(scale));
  });

  return (
    <g
      className="axis-grid"
      ref={axis}
      transform={`translate(${left}, ${height - bottom})`}
    />
  );
};

const YAxis = ({ top, bottom, left, right, scale, width }) => {
  const axis = useRef(null);

  useEffect(() => {
    d3.select(axis.current).call(d3.axisLeft(scale).tickSize(-width).ticks(10));
  });

  return (
    <g className="axis-grid" ref={axis} transform={`translate(${left}, ${top})`} />
  );
};

const Rect = ({ data, x, y, id,height }) => {
  const myRect = useRef(null);
  useEffect(()=>{
    d3.select(myRect.current).transition()
    .duration(200)
    .delay(id*25)
    .attr("y", y(data[1]))
    .attr("height", y(data[0]) - y(data[1]));
  })
  return (
    <g className="cost" fill={data.data["color-"+id]}>
      <rect
        ref={myRect}
        width={x.bandwidth()}
        height={0}
        fill={data.data["color-"+id]}
        x={x(data.data.name)}
        y={height}
      >
      </rect>
      {/* <text
        id={`value-${id}`}
        transform={`translate(${x(data.data.name) + x.bandwidth() / 2}, ${y(data.data.total) - 5})`}
        textAnchor="middle"
        alignmentBaseline="baseline"
        fill="grey"
        fontSize="10"
      >
        {format(data.data.total)}
      </text> */}
    </g>
  );
};

const StackBar = props => {

  const mydata = [...props.data];

  const mykeys = mydata[0].dataset.map(d => d.label);
  const newData = [];

  mydata.forEach((d)=>{
    var tempObj = {}
    tempObj.name = d.name;
    tempObj.total = d3.sum(d.dataset, (d,i) =>{ 
      tempObj[d.label] = d.value;
      tempObj["color-"+i] = d.color; 
      return +d.value
    });
    newData.push(tempObj);
    return d;
  });


  const mydataset = (d3.stack().keys(mykeys)(newData));

  console.log(newData[0]["color-1"])

  const mysvg = useRef(null);

  useEffect(() => {
    var legendIndex = 0;
    var x,y,checker = 0;
    var legend = d3.select(mysvg.current).selectAll(".legend")
    .data(mykeys)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {  
      if(props.height - props.bottom > (legendIndex * 19)){
        if(checker > 0){
          x=-(100 * checker);
        }else{
          x=0;
        }
        y = legendIndex * 15;
        legendIndex ++;
      }else{
        legendIndex = -1;
        checker++;
        x=-(100 * checker);
        y = legendIndex * 15;
        legendIndex ++;
      }

      return `translate(${x},${y})`;
       
    });
   
  legend.append("circle")
    .attr("cx", props.width - 18)
    .attr("cy",function(d,i){ return 10 + i})
    .attr("r", 6)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", function(d, i) { return newData[0]["color-"+i]; });
   
  legend.append("text")
    .attr("x", props.width - 30)
    .attr("y", function(d,i){ return 10 + i})
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .style("font-size", ".6rem")
    .text(function(d, i) { 
      return d;
    });


  });

var x = d3.scaleBand()
.range([0, props.width - props.left - props.right])
.padding(0.1)

var y = d3.scaleLinear()
.rangeRound([props.height - props.top - props.bottom, 0])

y.domain([0, d3.max(mydata, d => d3.sum(d.dataset, d => +d.value))]).nice();
x.domain(mydata.map(d => d.name));


  return (
    <>
      <svg ref={mysvg} width={props.width} height={props.height}>
        <XAxis
          scale={x}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={props.height}
        />
        <text x="60" y="160" className="y-label1" transform="rotate(270, 60, 200)">x-axis</text>
        <text x={props.width/2} y={props.height-5}>
            y-axis
        </text>
        <YAxis
          scale={y}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          width={props.width}
        />
        
        <g transform={`translate(${props.left}, ${props.top})`}>
          {mydataset.map((d, i) => (
              d.map((data,index)=>{
                return (<Rect
                  key={i+index}
                  id={i}
                  data={data}
                  x={x}
                  y={y}
                  height={props.height}
                />)
              })
          ))}
        </g>
      </svg>
    </>
  );
};

export default StackBar;

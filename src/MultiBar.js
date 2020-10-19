import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import "./styles.css";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");

const XAxis = ({ top, bottom, left, right, height, scale }) => {
  const axis = useRef(null);

  useEffect(() => {
    d3.select(axis.current).call(d3.axisBottom(scale))
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

const Rect = ({ data, x0,x1, y, height, top, bottom, id, dataNames }) => {
  const myRect = useRef(null);
  useEffect(()=>{
    d3.select(myRect.current).transition()
    .duration(200)
    .delay(id*150)
    .attr("y", y(data.value))
    .attr("height", height - bottom - top - y(data.value));
  })

  return (
    <g transform={`translate(${x0(dataNames[id])}, 0)`}>
      <rect
        ref={myRect}
        width={x1.bandwidth()}
        x={x1(data.label)}
        y={height}
        height={0}
        fill={data.color}
      >
      </rect>
    </g>
  );
};

const MultiBar = props => {
  // const [sort, setSort] = useState(false);

  // const data = sort
  //   ? [...props.data].sort((a, b) => b.value - a.value)
  //   : [...props.data];

  const mysvg = useRef(null);

  const data = [...props.data];

  const gData = data.map((d, i) =>{
    return d.dataset;
  })

  console.log(gData[0][0].color);

  useEffect(() => {
    var legendIndex = 0;
    var x,y,checker = 0;
    var legend = d3.select(mysvg.current).selectAll(".legend")
      .data(data[0].dataset.map(function(d) { return d.label; }))
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
      // .style("opacity","0");

      legend.append("circle")
          .attr("cx", props.width - 18)
          .attr("cy",function(d,i){ return 10 + i})
          .attr("r", 6)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d,i) { return gData[0][i].color; });

      legend.append("text")
      .attr("x", props.width - 30)
      .attr("y", function(d,i){ return 10 + i})
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .style("font-size", ".6rem")
      .text(function(d, i) { 
        return d;
      });

      // legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");


  });

 
  var dataNames = data.map(function(d) { return d.name; });
  var labelNames = data[0].dataset.map(function(d) { return d.label; });

  var x0 = d3.scaleBand()
  .rangeRound([0, props.width - props.left - props.right],1)
  .domain(dataNames).padding([0.2]);;

  const x1 = d3
    .scaleBand().domain(labelNames).rangeRound([0, x0.bandwidth()]);

  const y = d3
    .scaleLinear()
    .range([props.height - props.top - props.bottom, 0])
    .domain([0, d3.max(data, function(name) { return d3.max(name.dataset, function(d) { return +d.value; }); })]);

  return (
    <>
      <svg ref={mysvg} width={props.width} height={props.height}>
        <XAxis
          scale={x0}
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
          {gData.map((d, i) =>(
            d.map((mapData,index)=>{
              return (<Rect
              key={i+index}
              id={i}
              data={mapData}
              x0={x0}
              x1={x1}
              y={y}
              dataNames={dataNames}
              top={props.top}
              bottom={props.bottom}
              height={props.height}
            />)
            })
          ))}
        </g>
      </svg>
    </>
  );
};

export default MultiBar;

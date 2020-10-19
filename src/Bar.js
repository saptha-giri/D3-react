import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "d3-tip";
import "./styles.css";
import Tooltip from "./TootlTip";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");

const XAxis = ({ top, bottom, left, right, height, scale, xAxisGrid,xAxis }) => {
  const axis = useRef(null);
  const labelAxis = useRef(null);

  useEffect(() => {

  d3.select(axis.current)
  .call(xAxisGrid);

  d3.select(labelAxis.current)
  .call(xAxis).selectAll("text")	
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", ".15em")
  .attr("transform", function(d) {
      return "rotate(-40)" 
      });
  });

  return (
    <g>
      <g
      className="x axis-grid path-check"
      ref={axis}
      transform={`translate(${left+(scale.bandwidth()/2)+5.5}, ${height - bottom})`}
    />

    <g
      className="x axis-grid"
      ref={labelAxis}
      transform={`translate(${left}, ${height - bottom})`}
    />
    </g>
  );
};

const YAxis = ({ top, bottom, left, right, scale, width,yAxisGrid,yAxis }) => {
  const axis = useRef(null);
  const labelAxis = useRef(null);

  useEffect(() => {

  d3.select(axis.current).call(yAxisGrid);

  d3.select(labelAxis.current).call(yAxis);

  });

  return (
    <g>
      <g className="axis-grid path-check" ref={axis} transform={`translate(${left}, ${top})`} />
      <g className="axis-grid" ref={labelAxis} transform={`translate(${left}, ${top})`} />
    </g>
  );
};



const Rect = ({ data, x, y, height, top, bottom, id, isNegative, onMouseOutCallback, onMouseOverCallback }) => {
console.log(isNegative);
  const myRect = useRef(null);
  const myText = useRef(null);
  useEffect(()=>{
    d3.select(myRect.current).transition()
    .duration(750)
    .delay(id*10)
    .attr("y", y(Math.max(0, data.value)))
    .attr("height", isNegative ? Math.abs(y(data.value) - y(0)): (height - bottom - top - y(data.value)));

    d3.select(myText.current).transition()
    .duration(750)
    .delay(id*10)
    .attr("y", y(Math.max(0, data.value))-25);
  })
  return (
    <g>
      <rect
        ref={myRect}
        onMouseOver={()=>onMouseOverCallback(data)}
        onMouseLeave={()=>onMouseOutCallback(data)}
        width={x.bandwidth()}
        height={0} 
        // height={Math.abs(y(data.value) - y(0))}
        x={x(data.label)}
        y={height}
        
        fill={colors(id)}
      >
      </rect>
      <foreignObject ref={myText} x={x(data.label) - 20}
        y={height} width={x.bandwidth()} height="25">
        <div className="graph-label" style={{color:colors(id)}}>
        <text
      >
        {format(data.value)}
      </text>
        </div>
      </foreignObject>
    </g>
  );
};

const Bar = props => {

  const myContainer = useRef(null);
  const data = [...props.data];
  const [dimensions, setDimensions] = useState({ width:0, height: 0 });
  const [isNegative, setisNegative] = useState(false);
  const [tooltipData, setTooltipData] = useState(false);

  let minVal = d3.min(data, d => d.value);
  const maxVal = d3.max(data, d => d.value);

  useEffect(() => {
    console.log("cehck update")
    setDimensions({
      width: myContainer.current.offsetWidth,
      height: myContainer.current.offsetHeight
    });
    if(minVal < 0){
      setisNegative(true);
    }
  },[]);

 let ra = Math.max(Math.abs(minVal), Math.abs(maxVal))

 ra = ra + ((ra/100)*20);
 console.log("minVal",minVal);
 minVal = minVal - ((minVal/100)*20);

 console.log("minVal",minVal);

 console.log(ra);

  const x = d3
    .scaleBand()
    .range([0, dimensions.width - props.left - props.right])
    .domain(data.map(d => d.label))
    .padding(0.2);

  const y = d3
    .scaleLinear()
    .range([dimensions.height - props.top - props.bottom, 0])
    .domain([(minVal < 0)?-ra:minVal, ra]);

    let innerHeight = dimensions.height - props.top - props.bottom - 10;
    let innerWidth = dimensions.width - props.right - props.left - 5;
  
    const xAxis     = d3.axisBottom(x).ticks(10);
    const yAxis     = d3.axisLeft(y).ticks(10);
    const xAxisGrid = d3.axisBottom(x).tickSize(-innerHeight).tickFormat('').ticks(10);
    const yAxisGrid = d3.axisLeft(y).tickSize(-innerWidth).tickFormat('').ticks(10);

  return (
    <div className="mycontainer" ref={myContainer}>
      <svg width={dimensions.width} height={dimensions.height}>
        <XAxis
          scale={x}
          xAxis={xAxis}
          xAxisGrid={xAxisGrid}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={dimensions.height}
        />
        <text x="60" y="160" className="y-label1" transform="rotate(270, 60, 200)">x-axis</text>
        <text x={dimensions.width/2} y={dimensions.height-5}>
            y-axis
        </text>
        <YAxis
          scale={y}
          yAxis={yAxis}
          yAxisGrid={yAxisGrid}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          width={dimensions.width}
        />
        <g transform={`translate(${props.left}, ${props.top})`}>
          {data.map((d, i) => (
            <Rect
              key={i}
              id={i}
              data={d}
              x={x}
              y={y}
              isNegative={isNegative}
              top={props.top}
              bottom={props.bottom}
              height={dimensions.height}
              onMouseOverCallback={datum => setTooltipData({data: datum})}
              onMouseOutCallback={datum => setTooltipData({data: null})}
            />
          ))}
        </g>
      </svg>
      { tooltipData.data ?
          <Tooltip
            data={tooltipData}
            scales={{ x, y }}
          /> :
          null
        }
    </div>
  );
};

export default Bar;

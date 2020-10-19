import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./styles.css";

const colors = d3.scaleOrdinal(d3.schemeCategory10);
const format = d3.format(".2f");

const XAxis = ({ top, bottom, left, right, height, scale, xAxisGrid,xAxis }) => {
  const axis = useRef(null);
  const labelAxis = useRef(null);
  useEffect(() => {

    d3.select(axis.current)
  .call(xAxisGrid);

    d3.select(labelAxis.current).call(xAxis);
  });

  return (
    // <g
    //   className="axis-grid"
    //   ref={xaxis}
    //   transform={`translate(${left}, ${height - bottom})`}
    // />

    <g>
      <g
      className="x axis-grid path-check"
      ref={axis}
      transform={`translate(${left}, ${height - bottom})`}
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

    // d3.select(yaxis.current).call(d3.axisLeft(scale));
  });
console.log(left)
  return (
    // <g className="axis-grid" ref={yaxis}  transform={`translate(${left}, ${top})`}/>

    <g>
    <g className="axis-grid path-check" ref={axis} transform={`translate(${left}, ${top-18})`} />
    <g className="axis-grid" ref={labelAxis} transform={`translate(${left}, ${top})`} />
  </g>
  );
};

const Rect = ({ data, x, y, height, top, bottom, id, left, width,isNegative }) => {
  const myRect = useRef(null);
  const myText = useRef(null);
  useEffect(()=>{
    d3.select(myRect.current)
    .transition()
    .duration(750)
    .delay(id*10)
    .attr("y", y(data.label)-top)
    .attr("width", isNegative?Math.abs(x(data.value) - x(0)):x(data.value));

    d3.select(myText.current).transition()
    .duration(750)
    .delay(id*10)
    .attr("y", y(data.label)-top)
    .attr("x", (data.value<0)?0:x(data.value));
  })
  return (
    <g transform={`translate(0, ${top})`}>
      <rect
        ref={myRect}
        height={y.bandwidth()}
        width={0}
        fill={colors(id)}
        x={isNegative?x(Math.min(0, data.value)):0}
        y={y(data.label)-top}
      >
        <title>{format(data.value)}</title>
      </rect>
      
      {/* <text
        id={`hbar-value-${id}`}
        fill="grey"
        y={y(data.label) + y.bandwidth() / 2 - 18}
        x={(data.value<0)?x(data.value)+Math.abs(x(data.value) - x(0)):x(data.value)}
        // x={data.value<0?9:-9}
        fontSize="10"
      >
        {format(data.value)}
      </text> */}

      <foreignObject ref={myText}  x={0}
        y={y(data.label)-top}
        height={y.bandwidth()}
        width={y.bandwidth()*2.5}
        >
        <div className="graph-label" style={{color:colors(id)}}>
          <text> {format(data.value)} </text>
        </div>
      </foreignObject>
    </g>
  );
};

const HBar = props => {
  // const [sort, setSort] = useState(false);

  // const data = sort
  //   ? [...props.data].sort((a, b) => b.value - a.value)
  //   : [...props.data];

  const data = [...props.data];
  const [isNegative, setisNegative] = useState(false);

  let minVal = d3.min(data, d => d.value);
  const maxVal = d3.max(data, d => d.value);


  useEffect(() => {
    if(minVal < 0){
      setisNegative(true);
    }
  }, []);

  let ra = Math.max(Math.abs(minVal), Math.abs(maxVal))
  ra = ra + ((ra/100)*20);

  const y = d3
    .scaleBand()
    .domain(data.map(d => d.label))
    .rangeRound([0,props.height - props.top - props.bottom])
    .padding(0.2);

  const x = d3
    .scaleLinear()
    .range([0, props.width - props.left - props.right])
    .domain([(minVal < 0)?-ra:minVal, ra]);

    let innerHeight = props.height - props.top - props.bottom - 10;
    let innerWidth = props.width - props.right - props.left - 5;

    const xAxis     = d3.axisBottom(x).ticks(10);
    const yAxis     = d3.axisLeft(y).ticks(10);
    const xAxisGrid = d3.axisBottom(x).tickSize(-innerHeight).tickFormat('').ticks(10);
    const yAxisGrid = d3.axisLeft(y).tickSize(-innerWidth).tickFormat('').ticks(10);

  return (
    <>
      <svg width={props.width} height={props.height}>
        <XAxis
          scale={x}
          xAxis={xAxis}
          xAxisGrid={xAxisGrid}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          height={props.height}
          width={props.width}
        />
        <text x="60" y="160" className="y-label1" transform="rotate(270, 60, 200)">Make</text>
        <text x={props.width/2} y={props.height-5}>
            year
        </text>
        <YAxis
          scale={y}
          yAxis={yAxis}
          yAxisGrid={yAxisGrid}
          top={props.top}
          bottom={props.bottom}
          left={props.left}
          right={props.right}
          width={props.width}
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
              left={props.left}
              bottom={props.bottom}
              height={props.height}
              width={props.width}
            />
          ))}
        </g>
      </svg>
    </>
  );
};

export default HBar;

import React, { useEffect, useRef, useState } from "react";
import "./styles.css";
import * as d3 from "d3";
const colors = d3.scaleOrdinal(d3.schemeCategory10);

const Tooltip = ({ scales, data }) => {

    const { x, y } = scales
    const styles = {
      left: `${x(data.data.label)+150}px`,
      top: `${y(data.data.value)}px`
    }
  
    const colorLabel = {
      backgroundColor : colors(data.value),
      width:"10px",
      height:"10px"
    }
  
    // useEffect(() => {
  
    // },[]);
  
    return (
      <div className="Tooltip" style={styles}>
        <table>
          <thead>
            <tr>
              <th colSpan="2">{data.data.label}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan="1"><div style={colorLabel}></div>{data.data.value}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

export default Tooltip;
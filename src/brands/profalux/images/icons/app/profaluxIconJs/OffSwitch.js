import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const SvgOffSwitch = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 256 256"
    {...props}
  >
    <G
      style={{
        stroke: "none",
        strokeWidth: 0,
        strokeDasharray: "none",
        strokeLinecap: "butt",
        strokeLinejoin: "miter",
        strokeMiterlimit: 10,
        fill: "none",
        fillRule: "nonzero",
        opacity: 1,
      }}
    >
      <Path
        d="M26.523 71.523h36.954C78.125 71.523 90 59.648 90 45S78.125 18.477 63.477 18.477H26.523C11.875 18.477 0 30.352 0 45s11.875 26.523 26.523 26.523z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "#d3d3d3",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.33 0 0 2.33 22.612 22.612)"
      />
      <Path
        d="M26.517 64.025C16.01 64.025 7.492 55.507 7.492 45c0-10.507 8.518-19.025 19.025-19.025 10.507 0 19.025 8.518 19.025 19.025 0 10.507-8.518 19.025-19.025 19.025z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "#fff",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.33 0 0 2.33 22.612 22.612)"
      />
    </G>
  </Svg>
);
export default SvgOffSwitch;


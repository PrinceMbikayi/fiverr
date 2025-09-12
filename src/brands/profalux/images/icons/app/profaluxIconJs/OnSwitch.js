import * as React from "react";
import Svg, { G, Path } from "react-native-svg";
const SvgOnSwitch = (props) => (
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
        d="M64.903 70.097H25.097C11.236 70.097 0 58.861 0 45s11.236-25.097 25.097-25.097h39.806C78.764 19.903 90 31.139 90 45S78.764 70.097 64.903 70.097z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "orange",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.33 0 0 2.33 22.612 22.612)"
      />
      <Path
        d="M64.903 62.898c9.885 0 17.898-8.013 17.898-17.898s-8.013-17.898-17.898-17.898S47.005 35.115 47.005 45s8.013 17.898 17.898 17.898z"
        style={{
          stroke: "none",
          strokeWidth: 1,
          strokeDasharray: "none",
          strokeLinecap: "butt",
          strokeLinejoin: "miter",
          strokeMiterlimit: 10,
          fill: "#f9f9f9",
          fillRule: "nonzero",
          opacity: 1,
        }}
        transform="matrix(2.33 0 0 2.33 22.612 22.612)"
      />
    </G>
  </Svg>
);
export default SvgOnSwitch;


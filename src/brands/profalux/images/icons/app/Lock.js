import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgLock = (props) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M6 10V8c0-3.31 1-6 6-6s6 2.69 6 6v2M17 22H7c-4 0-5-1-5-5v-2c0-4 1-5 5-5h10c4 0 5 1 5 5v2c0 4-1 5-5 5Z"
      stroke={props.color || "#000"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M15.996 16h.01M11.995 16h.01M7.995 16h.008"
      stroke={props.color || "#000"}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgLock;


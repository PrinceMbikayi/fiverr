import * as React from "react";
import Svg, { Path } from "react-native-svg";

const SvgInfoCircleR = (props) => (
  <Svg
    data-name="Layer 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={24}
    height={24}
    {...props}
  >
    <Path
      d="M10.75.72a10 10 0 1 0 10 10 10 10 0 0 0-10-10ZM10.75 14.72v-5"
      fill="none"
      stroke={props.color || "#292d32"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
    <Path
      d="M10.76 6.72h0"
      fill="none"
      stroke={props.color || "#292d32"}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
    />
  </Svg>
);

export default SvgInfoCircleR;


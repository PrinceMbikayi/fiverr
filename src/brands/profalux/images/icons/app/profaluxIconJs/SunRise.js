import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSunRise = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.5 19a6.5 6.5 0 1 0-13 0"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m19.01 11.99.13-.13m-14.15.13-.13-.13"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M1.66 22h20.679M8.696 6.029l3.294-3.293 3.293 3.293M11.99 10.123v-7.3"
    />
  </Svg>
);
export default SvgSunRise;


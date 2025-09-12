import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgSunSet = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 25 24"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 19a6.5 6.5 0 1 0-13 0"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m19.51 11.99.13-.13m-14.15.13-.13-.13"
    />
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.16 22h20.679M15.783 6.83l-3.294 3.292L9.196 6.83M12.489 2.735v7.3"
    />
  </Svg>
);
export default SvgSunSet;


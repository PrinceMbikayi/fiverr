import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgWifi = (props) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    accessibilityRole="image"
    {...props}
  >
    <Path
      d="M4.91 11.84c4.3-3.32 9.89-3.32 14.19 0M2 8.36c6.06-4.68 13.94-4.68 20 0M6.79 15.49c3.15-2.44 7.26-2.44 10.41 0M9.4 19.15c1.58-1.22 3.63-1.22 5.21 0"
      stroke={props.color || "#000"}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
export default SvgWifi;


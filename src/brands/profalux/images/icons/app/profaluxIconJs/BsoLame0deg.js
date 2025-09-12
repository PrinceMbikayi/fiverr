import * as React from "react";
import Svg, { Path } from "react-native-svg";
const Svg90Deg = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M13.33 3.83v16.35c0 .67-.54 1.21-1.21 1.21h-.26c-.67 0-1.21-.54-1.21-1.21V3.83c0-.67.54-1.21 1.21-1.21h.26c.67 0 1.21.54 1.21 1.21Zm6.35 11.67-1.02-1.23-1.23 1.02-.09.96.37-.31c-.41.92-1.14 1.65-2.06 2.06l.31-.38-.96.09-1.02 1.23 1.23 1.02.96-.08-.69-.58c1.7-.5 3.03-1.83 3.53-3.53l.58.69.08-.96h.01Z"
    />
  </Svg>
);
export default Svg90Deg;


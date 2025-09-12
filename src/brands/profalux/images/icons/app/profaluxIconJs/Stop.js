import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgStop = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path fill={props.color} d="M6.46 6.46H18V18H6.46V6.46Z" />
  </Svg>
);
export default SvgStop;


import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgUp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M1.84 10.73h20.32l-8.62-7.92c-.87-.8-2.21-.8-3.07 0l-8.63 7.92Z"
    />
  </Svg>
);
export default SvgUp;


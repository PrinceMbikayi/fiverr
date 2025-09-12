import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgPlanTravail = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M22.16 13.38H1.84l8.62 7.92c.87.8 2.21.8 3.07 0l8.63-7.92Z"
    />
  </Svg>
);
export default SvgPlanTravail;


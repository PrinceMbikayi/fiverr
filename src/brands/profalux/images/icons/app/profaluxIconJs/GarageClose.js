import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgGarageFerme = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M24 11.39H0v1.49h24v-1.49Zm0-4.96H0v1.49h24V6.43Zm0 2.47H0v1.49h24V8.9Zm0 10.09H0v1.49h24v-1.49Zm0-4.96H0v1.49h24v-1.49Zm0 2.47H0v1.49h24V16.5ZM21.6 3.51H2.4v1.78h19.21V3.51Z"
    />
  </Svg>
);
export default SvgGarageFerme;


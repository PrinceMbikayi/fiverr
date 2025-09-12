import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgNuit = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M24 11.34A12.609 12.609 0 0 0 17.05.05a.562.562 0 0 0-.66.11.56.56 0 0 0-.1.66c1.18 2.35 1.52 5.03.97 7.6s-1.97 4.88-4.02 6.52a11.53 11.53 0 0 1-7.23 2.55c-1.8 0-3.57-.41-5.17-1.22-.22-.11-.49-.07-.66.1s-.22.44-.11.66a12.636 12.636 0 0 0 14.22 6.6c2.77-.66 5.23-2.23 6.99-4.47 1.76-2.23 2.72-5 2.72-7.84Z"
    />
  </Svg>
);
export default SvgNuit;


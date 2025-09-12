import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgBurger = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M1.17 3.22C.52 3.22 0 3.74 0 4.39s.52 1.17 1.17 1.17h21.66c.65 0 1.17-.52 1.17-1.17s-.52-1.17-1.17-1.17H1.17Zm0 7.61C.52 10.83 0 11.35 0 12s.52 1.17 1.17 1.17h21.66c.65 0 1.17-.52 1.17-1.17s-.52-1.17-1.17-1.17H1.17Zm0 7.61c-.65 0-1.17.52-1.17 1.17s.52 1.17 1.17 1.17h21.66c.65 0 1.17-.52 1.17-1.17s-.52-1.17-1.17-1.17H1.17Z"
    />
  </Svg>
);
export default SvgBurger;


import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgVector = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 21 33"
    {...props}
  >
    <Path
      fill={props.color}
      d="M8.436 33V19.25l-6.82 5.224L0 22.274l7.539-5.776L0 10.722l1.616-2.2 6.82 5.224V0L21 9.625 12.026 16.5 21 23.375zm2.692-13.75v8.25l5.385-4.125zm0-13.75v8.25l5.385-4.124z"
    />
  </Svg>
);
export default SvgVector;


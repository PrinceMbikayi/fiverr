import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgWindVector = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 22 21"
    {...props}
  >
    <Path
      stroke={props.color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.155 1.787 4.092 5.684A4.274 4.274 0 0 0 2.28 6.853c-.5.541-.84 1.187-.969 1.845-.13.657-.043 1.292.247 1.813.29.522.77.902 1.369 1.087l3.187 1.077c.437.148.811.4 1.094.737.282.336.466.749.536 1.205l.509 3.326c.078.622.37 1.16.833 1.536.462.376 1.073.571 1.743.557.67-.013 1.365-.236 1.985-.634a4.273 4.273 0 0 0 1.465-1.584l6.104-12.187a3.35 3.35 0 0 0 .354-1.674 2.453 2.453 0 0 0-.556-1.432 2.453 2.453 0 0 0-1.315-.797 3.35 3.35 0 0 0-1.71.059Z"
    />
  </Svg>
);
export default SvgWindVector;


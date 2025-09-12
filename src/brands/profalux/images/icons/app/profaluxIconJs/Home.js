import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgMaison = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M12 1.2c1.04 0 2.03.38 2.81 1.06l6.51 6.53c.99 1 1.55 2.32 1.55 3.74v10.26H1.13V12.53c0-1.41.55-2.74 1.55-3.74l6.51-6.53a4.19 4.19 0 0 1 2.8-1.06Zm0-1.13c-1.29 0-2.57.46-3.59 1.38L1.88 7.99A6.435 6.435 0 0 0 0 12.53v10.95c0 .25.2.45.45.45h23.1c.25 0 .45-.2.45-.45V12.53c0-1.7-.68-3.34-1.88-4.54l-6.53-6.55A5.356 5.356 0 0 0 12 .06Z"
    />
  </Svg>
);
export default SvgMaison;


import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgLogOut = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="m19.51 7.61-.87.85 2.98 2.98h-11.3v1.25h11.36l-3.04 3.01.87.88L24 12.09 19.51 7.6ZM14.1 17.1a7.567 7.567 0 0 1-5.54 2.44c-4.16 0-7.55-3.39-7.55-7.55S4.4 4.44 8.56 4.44c2.09 0 4.11.89 5.54 2.44l.12.13.71-.71-.11-.12a8.542 8.542 0 0 0-6.26-2.75C3.84 3.44 0 7.28 0 12s3.84 8.55 8.55 8.55c2.36 0 4.64-1 6.26-2.75l.11-.12-.71-.71-.12.13Z"
    />
  </Svg>
);
export default SvgLogOut;


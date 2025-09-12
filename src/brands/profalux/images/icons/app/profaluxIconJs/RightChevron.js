import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgChevron = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M19.2 11.99c0-.55-.21-1-.65-1.43L7.96.51C7.6.16 7.18 0 6.67 0 5.64 0 4.8.79 4.8 1.79c0 .49.22.95.59 1.31l9.41 8.88-9.41 8.91c-.37.36-.59.8-.59 1.31 0 1 .84 1.8 1.87 1.8.51 0 .94-.17 1.29-.52l10.59-10.06c.45-.43.65-.88.65-1.43Z"
    />
  </Svg>
);
export default SvgChevron;


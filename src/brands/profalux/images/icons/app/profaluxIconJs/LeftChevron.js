import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgRetour = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M3.79 12.01c0 .55.21 1 .65 1.43l10.59 10.05c.36.35.78.51 1.29.51 1.03 0 1.87-.79 1.87-1.79 0-.49-.22-.95-.59-1.31l-9.41-8.88 9.41-8.91c.37-.36.59-.8.59-1.31 0-1-.84-1.8-1.87-1.8-.51 0-.94.17-1.29.52L4.44 10.58c-.45.43-.65.88-.65 1.43Z"
    />
  </Svg>
);
export default SvgRetour;


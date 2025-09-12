import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgPortailOuvert = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M.89 2.89h.44c.49 0 .89.4.89.89v15.56H0V3.78c0-.49.4-.89.89-.89Zm21.78 0h.44c.49 0 .89.4.89.89v15.56h-2.22V3.78c0-.49.4-.89.89-.89ZM3.11 4.22h.44c.25 0 .44.2.44.44v13.33c0 .25-.2.44-.44.44h-.44c-.25 0-.44-.2-.44-.44V4.67c0-.25.2-.44.44-.44ZM0 19.78h24v1.33H0v-1.33Z"
    />
  </Svg>
);
export default SvgPortailOuvert;


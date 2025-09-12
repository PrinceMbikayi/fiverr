import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgPortailEntreouvert = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      fill={props.color}
      d="M.89 2.89h.44c.49 0 .89.4.89.89v15.56H0V3.78c0-.49.4-.89.89-.89Zm21.78 0h.44c.49 0 .89.4.89.89v15.56h-2.22V3.78c0-.49.4-.89.89-.89Zm-20 1.78V18c0 .25.2.44.44.44h8.44c.25 0 .44-.2.44-.44V4.67c0-.25-.2-.44-.44-.44H3.11c-.25 0-.44.2-.44.44Zm1.04 9.17a.445.445 0 0 1-.24-.58l3.05-7.3c.09-.23.36-.33.58-.24.23.09.33.36.24.58l-3.05 7.3c-.09.23-.36.33-.58.24Zm7.19-4.88-3.05 7.3c-.09.23-.36.33-.58.24a.445.445 0 0 1-.24-.58l3.05-7.3c.09-.23.36-.33.58-.24.23.09.33.36.24.58ZM0 19.78h24v1.33H0v-1.33Z"
    />
  </Svg>
);
export default SvgPortailEntreouvert;


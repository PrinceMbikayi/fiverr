import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgCloseCircleWhiteCross = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    xmlSpace="preserve"
    {...props}
  >
    <Path
      fill={props.color || "#000"}
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z"
    />
    <Path
      fill={props.color2 || "#FFF"}
      d="M15.4 14.3c.3.3.3.8 0 1.1-.1.2-.3.2-.5.2s-.4-.1-.5-.2L12 13.1l-2.3 2.3c-.1.2-.3.2-.5.2s-.4-.1-.5-.2c-.3-.3-.3-.8 0-1.1L11 12 8.6 9.7c-.3-.3-.3-.8 0-1.1s.8-.3 1.1 0l2.3 2.3 2.3-2.3c.3-.3.8-.3 1.1 0s.3.8 0 1.1L13.1 12l2.3 2.3z"
    />
  </Svg>
);
export default SvgCloseCircleWhiteCross;


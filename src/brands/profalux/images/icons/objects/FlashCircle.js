import * as React from "react";
import Svg, { Path } from "react-native-svg";
const SvgFlashCircle = (props) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2Zm3.53 11.23-5.18 3.59c-.76.53-1.2.22-.98-.67l.95-3.84-1.65-.41c-.75-.18-.84-.7-.21-1.14l5.18-3.59c.76-.53 1.2-.22.98.67l-.95 3.84 1.65.41c.75.19.84.7.21 1.14Z"
      fill={props.color || "#000"}
    />
  </Svg>
);
export default SvgFlashCircle;


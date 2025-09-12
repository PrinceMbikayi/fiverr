import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SvgGroup = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      d="M0 0v24h24V0H0Zm23.04 23.04H.96V.96h22.08v22.08Zm-2.33-9.13 1.78 3.04H8.09l3.04-3.04h9.59Zm0 4 1.78 3.04H4.08l3.04-3.04h13.59Zm.52-16L2.4 20.75V1.91h18.84Zm-.52 8 1.78 3.04h-10.4l3.04-3.04h5.59Zm-.63-4.96 1.52-1.52.89 1.52h-2.4Zm.63.96 1.78 3.04h-6.4l3.04-3.04h1.59Z"
      fill={props.color || '#000'}
    />
  </Svg>
);
export default SvgGroup;


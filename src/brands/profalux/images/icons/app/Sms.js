import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgSms = (props) => (
  <Svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M17 20.5H7c-3 0-5-1.5-5-5v-7c0-3.5 2-5 5-5h10c3 0 5 1.5 5 5v7c0 3.5-2 5-5 5Z"
      stroke={props.color || '#000'}
      fill={props.color || '#000'}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="m17 9-3.13 2.5c-1.03.82-2.72.82-3.75 0L7 9"
      stroke={props.color2 || '#FFF'}
      strokeWidth={1.5}
      strokeMiterlimit={10}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default SvgSms;


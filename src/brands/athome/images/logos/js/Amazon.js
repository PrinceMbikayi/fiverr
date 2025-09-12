import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgAmazon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    style={{
      enableBackground: 'new 0 0 20 20',
    }}
    xmlSpace="preserve"
    {...props}>
    <Path
      d="M17.3 9.8c-2 1.5-4.8 2.2-7.3 2.2-3.4 0-6.6-1.3-8.9-3.4-.2-.2 0-.4.2-.3 2.5 1.5 5.7 2.4 8.9 2.4 2.2 0 4.6-.5 6.8-1.4.3-.1.6.3.3.5"
      style={{
        fill: '#f90',
      }}
    />
    <Path
      d="M18.1 8.9c-.3-.3-1.7-.2-2.3-.1-.2 0-.2-.1 0-.3 1.1-.8 3-.6 3.2-.3.2.3-.1 2.1-1.1 3-.2.1-.3.1-.2-.1.1-.6.6-1.9.4-2.2"
      style={{
        fill: '#f90',
      }}
    />
  </Svg>
);

export default SvgAmazon;

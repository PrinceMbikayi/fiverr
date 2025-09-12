import * as React from 'react';
import Svg, {G, Path} from 'react-native-svg';

const SvgVuesaxBoldUp = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <G fill={props.color || '#000'} data-name="vuesax/bold/next">
      <Path
        data-name="Vector"
        d="M7.22 20.24h9.57A2.556 2.556 0 0 0 19 16.41l-2.39-4.15-2.4-4.15a2.544 2.544 0 0 0-4.41 0l-2.4 4.15-2.39 4.15a2.553 2.553 0 0 0 2.21 3.83ZM18.93 3.76a.755.755 0 0 1-.75.75H5.82a.755.755 0 0 1-.75-.75.755.755 0 0 1 .75-.75h12.36a.749.749 0 0 1 .75.75Z"
      />
    </G>
  </Svg>
);

export default SvgVuesaxBoldUp;


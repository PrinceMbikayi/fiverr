import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgVuesaxBoldRecordCircle = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <Path
      d="M11.97 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10ZM12 16.23A4.23 4.23 0 1 1 16.23 12 4.225 4.225 0 0 1 12 16.23Z"
      fill={props.color || '#000'}
      data-name="vuesax/bold/record-circle"
    />
  </Svg>
);

export default SvgVuesaxBoldRecordCircle;


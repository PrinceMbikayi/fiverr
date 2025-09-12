import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgApple = (props) => {
  const {fill = "#000000"} = props;
 
  return (

  
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    
      xmlSpace="preserve"
      {...props}>
      <Path d="M16.9 7.1c-.1.1-1.9 1.1-1.9 3.4 0 2.7 2.3 3.6 2.4 3.6 0 .1-.4 1.3-1.2 2.6-.8 1.1-1.6 2.2-2.8 2.2s-1.5-.7-3-.7c-1.4 0-1.9.7-3 .7s-1.9-1-2.8-2.3c-1-1.5-1.9-3.8-1.9-6 0-3.5 2.3-5.4 4.5-5.4 1.2 0 2.2.8 2.9.8.7 0 1.8-.8 3.2-.8.6.1 2.4.1 3.6 1.9zm-4.2-3.3c.6-.7 1-1.6 1-2.5V.9c-.9 0-2 .6-2.6 1.4-.5.6-1 1.5-1 2.4V5h.2c.8.1 1.8-.4 2.4-1.2z"  style={{
          fill:fill,
        }}/>
    </Svg>
  );
}
export default SvgApple;

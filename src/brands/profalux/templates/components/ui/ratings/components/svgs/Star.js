import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const SvgStar = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
    <Path
      d="m18.421 4.087 2.464 4.94a3.043 3.043 0 0 0 1.988 1.473l4.466.744c2.856.477 3.528 2.554 1.47 4.6l-3.472 3.48a3.052 3.052 0 0 0-.728 2.54l.992 4.313c.784 3.41-1.022 4.729-4.032 2.947l-4.186-2.484a3.02 3.02 0 0 0-2.772 0l-4.184 2.481c-3 1.782-4.816.449-4.032-2.947l.994-4.308a3.052 3.052 0 0 0-.728-2.54l-3.472-3.48c-2.043-2.048-1.388-4.125 1.47-4.602l4.466-.744a3.05 3.05 0 0 0 1.976-1.473l2.462-4.94c1.344-2.68 3.528-2.68 4.858 0Z"
      fill="#ffaa0b"
      stroke="#fdaa0b"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    />
  </Svg>
);

export default SvgStar;


import React from 'react';
import { Divider } from 'react-native-elements';
export const MyDivider = (props) => {  
  return <Divider style={{ backgroundColor:props.color}} />;
}
import React, { useEffect } from 'react';
import {TouchableHighlight,Text} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';

import R1 from './svgs/R1'
import R4 from './svgs/R4'
import RGreat from './svgs/RGreat'



/**
 * 
 * @param {object} props 
 * @param {string} props.title 
 * @param {function} props.callback
 * @param {object} [props.containerStyle]
 * @param {string} [props.bgColor] 
 * @param {object} [props.titleStyle]
 * @param {string} [props.titleColor]  
 * @param {boolean} [props.altStyle]  
 * @param {boolean} [props.noBorder]  
 * @returns 
 */

const RImage = (props) => {

   
    const ratings = [R1,R1,R1,R4,R4]
    const {rating = 2,isGreat} = props
    console.log('RImage props',props)

    useEffect(()=> {
      console.log('propsis great',props)
    },[isGreat])
    const CurrentImage = () => {
      console.log('isGreat',isGreat)
      if(isGreat) return <RGreat/>
        const RenderIcon = ratings[rating-1];
        return <RenderIcon/>
   
   }


    return ( 
       <>
       <CurrentImage/>
       </>
     );
}

export default RImage
 
import React from 'react';
import {useEffect,useMemo,useState} from 'react';
import {View,TouchableHighlight,Text,Pressable} from 'react-native';
import styled,{ThemeProvider} from 'styled-components/native';
import { useTheme } from '_theming/themeProvider';



import StarIcon from './svgs/Star'
import LinearStarIcon from './svgs/LinearStar'

const RateItem = (props) => {
  const {activeIcon,inactiveIcon,index,currentIndex,onPress} = props

  const doOnPress = () => {
    console.log('doOnPress',index,onPress);
    if(onPress)onPress(index)
  }

  return (<Pressable style={{height:32,width:32,flex:1}} onPress={doOnPress}>
             {(index <= currentIndex) ? <StarIcon/> :  <LinearStarIcon/> }
         </Pressable>
   
  )
}

const RateItems = (props) => {

    const {rating = 2,starNumber = 5,onChange} = props

    console.log("RateItems",props);
    const [items, setItems] = useState(null);

    useEffect(()=> {

     
      const generateItems  = () =>  {
          const arr = [...Array(starNumber).keys()];        
          const display = arr.reduce((r,v,i) => {          
            r.push(<RateItem activeIcon={StarIcon} inactiveIcon={LinearStarIcon}  index = {i+1} currentIndex={rating} onPress={onChange}/>)
            return r;
          },[])
         
           return <View style={{marginLeft:16,marginRight:16,height:32}}>
                    <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    {display}
                    </View>                    
                </View>
        }

        setItems(generateItems)
    },[rating])

    return ( 
        <>
       {items}
       </>
     );
}

export default RateItems


 
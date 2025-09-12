import React from 'react';
import { useRef, useEffect,useState,useImperativeHandle } from 'react';
import { Animated,Text,View,Switch,TouchableOpacity} from 'react-native'; // use in styled components

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { isArray } from 'lodash';



import { useTheme } from '_theming/themeProvider';


const BottomModal = React.forwardRef((props,ref) => {
   
    const { t, i18n } = useTranslation();
    const { theme} = useTheme();   
    const color = theme.onBody;
    const [isActive,setIsActive] = useState(false)
    //const fadeAnim = useRef(new Animated.Value(0)).current  // Initial val

    const modalHeight = 400;
    const closePos = -modalHeight;

    const bottomPos = useRef(new Animated.Value(closePos)).current 


    useImperativeHandle(ref, () => ({

        getAlert : () => {
          //console.log("getAlert from Child called by parent");
        },
        toggle: (itemId,mContentType) => {
            console.log("toggle");
            doAnimation(closePos)
            console.log("/toggle");
        },
        open: (itemId,mContentType) => {
         setIsActive(true)
      }
      }),[]);

    
      const doAnimation = (dest) => {
        console.log("doAnimation",dest)
        Animated.timing(
            bottomPos,
            {
              toValue: dest,
              duration: 200,
            }
          ).start(({ finished }) => {
            /* completion callback */
            console.log("fini",dest);
           if(dest == closePos) {
             setIsActive(false);
             console.log("c'est fermé")
           }
          });
      }


    useEffect(() => {
      console.log("XXX UseEffet [isActive]",isActive,bottomPos)
      if(isActive) {
        doAnimation(0);
      }
       
    }, [isActive]);

    const iconDefaultSize = 36;

    const closeMe = () => {
      doAnimation(closePos)
    }

    useEffect(() => {
     console.log("children change")
     console.log(props.children)  
    }, [props.children]);


    return (
            <Animated.View style={{position:'absolute',left:(isActive)? 0 : -1000,top:0,bottom:0,width:'100%',backgroundColor:'#00000077'}}>
              
                <TouchableOpacity  activeOpacity={1}  onPress={closeMe} pointerEvents={'box-none'} style={{width:'100%',height:'100%'}}>  
                    <View></View>
                </TouchableOpacity>
                <Animated.View style={{height:modalHeight,width:'100%',backgroundColor:'orange',position:'absolute',bottom:bottomPos,overflow:'hidden'}} zindex={3}>
                    <Container>                    
                      {props.children}                     
                    </Container>
                </Animated.View>
            </Animated.View>
                
                    
        )
})

export default BottomModal

const Container = styled.View`
    flex:1;
    height:100%;
    width:100%;
    border-top-left-radius: 22px;
    border-top-right-radius: 22px;
    background-color:white;
    padding:11px;
    overflow:hidden;
`;
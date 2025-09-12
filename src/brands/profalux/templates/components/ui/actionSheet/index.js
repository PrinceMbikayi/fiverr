import React from 'react';
import {useState,useRef,useImperativeHandle} from 'react';
import { View,Animated,Easing} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';

import {useGlobalModal} from '_components/ui/globalModal';

 const ActionSheet = React.forwardRef((props, ref) => {

  /*
    useEffect(() => {
        AvoidSoftInput.setAdjustNothing();
        AvoidSoftInput.setEnabled(true);
      }, []);
      */

    const { t, i18n } = useTranslation();
    const {callback,children} = props;
    const [isVisible,setIsVisible] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
     // REF methods can be called (useImperativeHandle)

     const animatedValue = useRef(new Animated.Value(0)).current;
     const asHeight = useRef(200);
    const globalModal = useGlobalModal()


    /*

     useEffect(() => {
        // start the animation when the keyboard appears
        Keyboard.addListener("keyboardWillShow", (e) => {
          // use the height of the keyboard (negative because the translateY moves upward)
         // startAnimation(-e.endCoordinates?.height);
         console.log("keyboardWillShow > e.endCoordinates?.height",e.endCoordinates?.height)
         const destHeight = e.endCoordinates?.height;
         console.log("destHeight",destHeight)
            setTranslateY(animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0,-destHeight],
                extrapolate: 'clamp'
            }))
            startAnimation(1); 
        });
        // perform the reverse animation back to keyboardOffset initial value: 0
        Keyboard.addListener("keyboardWillHide", () => {
          //startAnimation(0);
        });
        Keyboard.addListener("keyboardDidHide", () => {
            //startAnimation(0);
            setIsVisible(false)
          });

         // start the animation when the keyboard appears
         if(1 == 1) {

        
         Keyboard.addListener("keyboardDidShow", (e) => {
            // use the height of the keyboard (negative because the translateY moves upward)
           // startAnimation(-e.endCoordinates?.height);
           console.log("DiDSHOW e.endCoordinates?.height",e.endCoordinates?.height)
           const destHeight = e.endCoordinates?.height;
           console.log("destHeight",destHeight)
              setTranslateY(animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0,-destHeight],
                  extrapolate: 'clamp'
              }))
              if(!isOpen)startAnimation(1); 
              setIsOpen(true)
          });
         }

          Keyboard.addListener("keyboardDidHide", () => {
            //startAnimation(0);
            //setIsVisible(false);
            globalModal.close()
          });




        return () => {
          // remove listeners to avoid memory leak
          Keyboard.removeAllListeners("keyboardWillShow");
          Keyboard.removeAllListeners("keyboardWillHide");
          // 
          Keyboard.removeAllListeners("keyboardDidShow");
        };
      }, []);
    

      */






     const startAnimation = toValue => {
        console.log("ActionSheet start",toValue)
         Animated.timing(animatedValue, {
             toValue,
             duration: 260+80,
             easing: Easing.out(Easing.sin),
             useNativeDriver: true
         }).start(({ finished }) => {
            /* completion callback */          
            if(toValue == 0) {
                setIsVisible(false)
            }else {
                setIsVisible(1)
            }
          })
     }
     const myHeight = 20000
     const initialHeight = 20000000;
     const [translateY, setTranslateY] = useState(animatedValue.interpolate({
                                                                    inputRange: [0, 1],
                                                                    outputRange: [initialHeight,0],
                                                                    extrapolate: 'clamp'
                                                                })
            );
    
  
     const translateY_regular = animatedValue.interpolate({
         inputRange: [0, 1],
         outputRange: [myHeight,0],
         extrapolate: 'clamp'
     })


     useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
            
            console.log("toggleMe for android");
            //if(!isVisible)startAnimation();            
            //setIsVisible(!isVisible)
            
        }
      }));


    const onCallback = (id) => {
        console.log("eh oh ",id);
       
        if(callback != undefined )callback(id)
    }
  
    const onCancel = () => {
        //setIsVisible(false);
        startAnimation(0);
    }
    /*
    useEffect(()=> {
        startAnimation(1);
    },[])
    */
    const onLayout = (event) => {
        var {x, y, width, height} = event.nativeEvent.layout;
        console.log("actionSheet onLayout: ",x,y,width,height);
       /*
        setTranslateY(animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [height,0],
            extrapolate: 'clamp'
        })
       
        )
        */

        
    }

    

    return (
            <>
            {isVisible  && 
                     <View style={{backgroundColor:'orange',paddingTop:0}} onLayout={onLayout}>                       
                      
                            <Selector>
                                {children}
                            </Selector>
                      
                    </View>                      
                      
                
            }
            </> 
    )    
})
export default ActionSheet



export const Selector2 = styled.View`
    position:absolute; 
    bottom:0px;
    width:100%;
    background-color:red;
    padding:10px;
    border-top-left-radius : 20px;
    border-top-right-radius : 20px;
    z-index:12;
    flex:1;
`;

export const Selector= styled.View`
   
    background-color: transparent;
    padding:10px;
    border-top-left-radius : 20px;
    border-top-right-radius : 20px;
    width:100%;
    padding-bottom:30px;
    border-width:2px;
    border-color:red;
   
    
`;
//exemple Animated custom Component or Styled Component
const AnimatedSelector = Animated.createAnimatedComponent(Selector);

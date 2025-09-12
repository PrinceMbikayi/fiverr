import React,{useRef,useState,useEffect,useMemo,useCallback,forwardRef,useImperativeHandle} from 'react';
import { View,Text,Animated, Keyboard,Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



import Button from '../../ui/Button';
import {useGlobalModal} from '_components/ui/globalModal';

import EditContent from './editContentBottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';


import MyBottomSheetModal from '_brand/templates/components/ui/bottomSheet';



const InputSolo = forwardRef((props, ref) => {


    const { top: topSafeArea, bottom: bottomSafeArea } = useSafeAreaInsets();

    const { t, i18n } = useTranslation();
    const {value,placeholder = "placeholder not defined",hidden,onValidate,onCancel} = props
    const globalModal = useGlobalModal();
    const [isOpen, setIsOpen] = useState(false);
    
    const initialValueRef = useRef("")

    const onEdit = () => {
        handlePresentModalPress();
    }

    useImperativeHandle(ref, () => ({

      getAlert() {
      },
      toggle() {
          
          onDoToggle();
         
          
      }
    }));

    const onDoToggle = () => {
      if(!isOpen) {
        bottomSheetModalRef.current?.present();
        setIsOpen(true)
      } else {
        bottomSheetModalRef.current?.dismiss();
        setIsOpen(false)
      }
    }



    const onEditOld = () => { 
        
        const content = <EditContent value={value}/>                            
        //const content = <Text style={{backgroundColor:'red'}}>voilou</Text>
        globalModal.setContent(content);    
        globalModal.toggle();

    }


    const bottomSheetModalRef = useRef(null);
    const snapPoints = useMemo(() => [180], []);
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
      }, []);
      const handleCloseModalPress = useCallback(() => {
        bottomSheetModalRef.current?.dismiss();
      }, []);

    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');
    const renderBackdrop = useCallback(
        props => (
          <BottomSheetBackdrop {...props} snapPoints={snapPoints} pressBehavior={backdropPressBehavior} />
        ),
        [backdropPressBehavior]
      );

    const handleSheetChanges = () => {
        
    }

  const [extraPadding, setExtraPadding] = useState(16);
   

  //  <Animated.View  style={{ transform: [{ translateY }]}} >
      
  useEffect(() => {
    // start the animation when the keyboard appears
   
    Keyboard.addListener("keyboardWillShow", (e) => {
      if(Platform.OS == 'ios') {
     
        const keyboardHeight = e.endCoordinates?.height;
        setExtraPadding(keyboardHeight+16)
      }
    
    });
    // perform the reverse animation back to keyboardOffset initial value: 0
    Keyboard.addListener("keyboardWillHide", () => {
      //startAnimation(0);
    });
    Keyboard.addListener("keyboardDidHide", () => {
      
    });
     // start the animation when the keyboard appears    
     Keyboard.addListener("keyboardDidShow", (e) => {
     });
    return () => {
      // remove listeners to avoid memory leak
      Keyboard.removeAllListeners("keyboardWillShow");
      Keyboard.removeAllListeners("keyboardWillHide");
      // 
      Keyboard.removeAllListeners("keyboardDidShow");
    };
  }, []);
  //-----------------------------

  useEffect(()=> {
    initialValueRef.current = value;
  },[]);




  const doCancel = () => {
    if(Platform.OS == 'ios')Keyboard.dismiss();
    onDoToggle();
    //bottomSheetModalRef.current.dismiss();
    if(onCancel)onCancel()
  }

  const [ff, setFf] = useState(false);
  const doIndexZero = () => {
    setFf(true)
  }
 
  const [knownHeight, setKnownHeight] = useState(false);


  const onLayout = (event) => {
    var {x, y, width, height} = event.nativeEvent.layout;
    
  }


    return ( 
        <View>
          {!hidden  && 
          <>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{fontWeight:'bold'}}>{t("qrbasic:INPUT_OBJECT_LABEL")}</Text>
                <Button title="Modifier" titleStyle={{fontWeight:"normal"}} noBorder altStyle onPress={onEdit}/>
            </View>
            <Text>{value}</Text>
            </>
          }
            <Animated.View  >
            
              <MyBottomSheetModal  myRef={bottomSheetModalRef} cbIndexZero={doIndexZero} onCancel={doCancel}>
                <View onLayout={onLayout} style={{width:'100%',backgroundColor:'white',paddingTop:16,paddingBottom:16,padding:16,borderTopLeftRadius:16,borderTopRightRadius:16,paddingBottom:extraPadding}} >
                    <EditContent value={value} onCancel={doCancel} onDoFocus={ff} onValidate={onValidate} placeholder={placeholder}/> 
                </View>
               
              </MyBottomSheetModal>
            
            </Animated.View>
            {/*
            <BottomSheetModal
                          ref={bottomSheetModalRef}
                          index={0}                                              
                          snapPoints={snapPoints}
                          onChange={handleSheetChanges}
                          backdropComponent={renderBackdrop}
                          topInset={topSafeArea}
                        >
                       <EditContent value={value}/> 
                        </BottomSheetModal>
            */}
           
        </View>
         



     );
})

/**
 * 
 * @param {object} props 
 * @param {string} props.value
 * @returns 
 */
export default InputSolo;

/*
InputSolo.propTypes = {
 
  name: "string",
}
*/
/*
<Pressable onPress={onEdit} >
<InputText {...props}/>
</Pressable>
*/
import React from 'react';
import {useState,useRef,useEffect,useMemo,useCallback} from 'react';
import { View} from 'react-native';

//-----------------------------------
import { BottomSheetModal,BottomSheetView,BottomSheetBackdrop} from '@gorhom/bottom-sheet';


const MyBottomSheet = (props) => {

    const {children,myRef,cbIndexZero,heightKnown = 90,enabledGesture = true,realContent} = props
    


    const [backdropPressBehavior, setBackdropPressBehavior] = useState('collapse');

    const renderBackdrop = useCallback(
      props => {
        //console.log("renderBackdrop",props)
        return (
        <BottomSheetBackdrop key="backdrop" {...props}  pressBehavior="collapse"/>
      )},
      []
    );
    
    const bottomSheetModalRef =  myRef ||  useRef(null);
    const [contentHeight, setContentHeight] = useState(heightKnown);
    const snapPoints = useMemo(() => {                         
                          const retVal = [contentHeight,contentHeight];                         
                         // console.log("change snapPoints XXXXXX",retVal)
                          return retVal},
                        [contentHeight]);

    //const renderBackdropRef = useRef(null);

    const renderBackdropRef = useRef();
   
    //const snapPoints = useMemo(() => [120,'25%'], []);

    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
    }, []);
    const handleCloseModalPress = useCallback(() => {
      bottomSheetModalRef.current?.dismiss();
    }, []);


    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);


      if(index == 0 || index == -1) {
        if(cbIndexZero)cbIndexZero(index)
      }

    }, []);
    const handleSheetAnimate = useCallback((index) => {
      console.log('handleSheetAnimate', index);

    }, []);

    const onOpenSelect = () => {  
       // callbacks
       handlePresentModalPress();
    }


    const [layoutDone, setLayoutDone] = useState(null);

    const onLayout = (event) => {
      var {x, y, width, height} = event.nativeEvent.layout;
      renderBackdropRef.current = renderBackdrop; 
      setTimeout(()=> { setContentHeight(height);console.log("after setContentHeight ",height) },0)
      
      setLayoutDone(true);

      
  }


  


 
  const closeModalSheet = React.useCallback((value) => {
    // Do something here with value
    console.log("do something !!!");
    handleCloseModalPress()
  }, []);

    return (
     
         <BottomSheetModal
                          ref={bottomSheetModalRef}
                          name="MyBS"
                          index={1}
                          handleComponent={null}                       
                          snapPoints={snapPoints}
                          onAnimate={handleSheetAnimate}
                          onChange={handleSheetChanges}
                          backdropComponent={renderBackdrop}
                          enableContentPanningGesture={enabledGesture}
                          animationDuration={250}
                          animateOnMount={true}
                          enableDismissOnClose
                        ><BottomSheetView style={{backgroundColor:"red"}} >
                            <View onLayout={onLayout}>
                             <View style={{minHeight:220,backgroundColor:"green"}}>
                              {children}
                             </View>
                            </View>
                           
                        </BottomSheetView>
                              
        </BottomSheetModal>
     
    )        
}

const MemoizedMyBottomSheet = MyBottomSheet;

export default MemoizedMyBottomSheet
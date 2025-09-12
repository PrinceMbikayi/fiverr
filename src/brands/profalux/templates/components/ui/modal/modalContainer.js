
import React from 'react';
import {View,TouchableHighlight,Pressable,Text} from 'react-native'
import styled,{ThemeProvider} from 'styled-components/native';

import CloseCircle from '_brand/images/icons/app/CloseCircle';
import {useGlobalModal} from '_components/ui/globalModal';

import ModalContent from './modalContent';

/**
 * 
 * @param {object} props 
 * @param {string} props.title;
 * @param {object} [props.titleStyle]
 * @param {string} [props.description]
 * @param {array}  props.buttons an array of objects
 * @param {JSX} [props.illustration]
 * @param {"top"|"afterTitle"|"afterDescription"} [props.illustrationPos] default top
 * @param {true|false} [props.hideCloseButton] default false
 * @returns 
 */
const ModalContainer = (props) => {

    const {title,description,form,buttons,titleStyle,illustration,illustrationPos,hideCloseButton=false} = props;
   

   const globalModal = useGlobalModal()
    const closeModal = () => {
        globalModal.cancel();
    };

    const onPress = (e) => {
        console.log("ooooooooo")
    }

    return ( 
        <Pressable onPress={onPress}>
        <ContainerView pointerEvents='auto'>
            {(!hideCloseButton) ?   <TouchableHighlight onPress={closeModal} style={{alignSelf:'flex-end',marginRight:4,marginTop:4,backgroundColor:'transparent',borderRadius:8}} underlayColor="#eee"><CloseCircle/></TouchableHighlight> 
                                    : 
                                    <View style={{height:24}}/>
            }
            <ChildrenView>
                {props.children}
                <ModalContent {...{title,titleStyle,description,form,buttons,illustration,illustrationPos,"aaa":"bbb"}} />
            </ChildrenView>
          
        </ContainerView>
        </Pressable>
     );
}
 
export default ModalContainer;


const ContainerView = styled.View`
    background-color:white;
    border-radius:16px;
    padding:0px;
`;

const ChildrenView = styled.View`
  
    padding:16px;
    padding-top:0
`;
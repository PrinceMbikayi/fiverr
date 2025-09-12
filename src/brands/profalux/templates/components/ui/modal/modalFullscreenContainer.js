
import React from 'react';
import { useEffect } from 'react';
import {View,TouchableHighlight,Pressable,Text,BackHandler} from 'react-native'
import styled,{ThemeProvider} from 'styled-components/native';

import CloseCircle from '_brand/images/icons/app/CloseCircle';
import {useGlobalModal} from '_components/ui/globalModal';
import ModalContent from './modalContent';

/**
 * 
 * @param {object} props 
 * @param {string} props.title;
 * @param {string} [props.description]
 * @param {array}  props.buttons an array of objects
 * @param {JSX} props.illustration a SVG to 
 * @returns 
 */
const FullScreenModalContainer = (props) => {

    const {illustration,title,description,form,buttons,doBackHandler} = props;
    

   const globalModal = useGlobalModal()
    const closeModal = () => {
        globalModal.close();
    };

    const onPress = (e) => {
        console.log("ooooooooo")
    }

    const handleBackPress = (e) => {
        console.log(e);
        if(doBackHandler)doBackHandler();
        closeModal();
        
        return true; 
    }


    useEffect(() =>{
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
            console.log("je suis retiré")
        };
      }, []);

    return ( 
        <Pressable onPress={onPress}>
        <ContainerView pointerEvents='auto'>
            <TouchableHighlight onPress={closeModal} style={{alignSelf:'flex-end',marginRight:4,marginTop:4,backgroundColor:'transparent',borderRadius:8}} underlayColor="#eee"><CloseCircle/></TouchableHighlight>
            <ChildrenView>
                {props.children}
                <ModalContent {...{illustration,title,description,form,buttons,"aaa":"bbb"}} />              
            </ChildrenView>
          
        </ContainerView>
        </Pressable>
     );
}
 
export default FullScreenModalContainer;


const ContainerView = styled.View`
    background-color:white;
    border-radius:0px;
    padding:0px;
    width:100%;  
    height:100%;
`;

const ChildrenView = styled.View`
    margin-top:40px;
    padding:16px;
    padding-top:0;
`;
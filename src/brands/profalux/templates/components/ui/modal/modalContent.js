import React from 'react';
import {View,TouchableHighlight,Text} from 'react-native'
import styled,{ThemeProvider} from 'styled-components/native';

import {H1,P} from  '_brand/templates/styled'; 
import Button from '_brand/templates/components/ui/Button';

import CloseCircle from '_brand/images/icons/app/CloseCircle';
import {useGlobalModal} from '_components/ui/globalModal';




const ModalContent = (props) => {
   const {illustration,illustrationPos = "top",title,titleStyle = {},description,form,buttons} = props;


console.log("ModalContent",props)

    console.log('titleStyle',titleStyle)
    return ( 
        <View style={{justifyContent:"center",alignItems:"center",padding:0, backgroundColor:'transparent'}}>
            {title && 
                <View style={{marginTop:12}}>
                    <Text>{title}</Text>
                </View>
            }
            {description && 
                <View style={{marginTop:12}}>
                    <Text>{description}</Text>
                </View>
            }

        {buttons &&
            <View style={{marginTop:50, flexDirection:"row",justifyContent:"space-evenly",width:"100%",backgroundColor:'transparent'}}>
                {buttons.map((v,i)=> {
                    console.log("xx buttons",v)
                    return (
                        <View style={{width:"45%"}}>
                            <Button key={"popUpBtn_"+i} titleColor={"white"} bgColor={"#3E495E"} title={v?.label} onPress={v.callback} {...(v?.altStyle) ? {altStyle :v.altStyle} : {}} {...(v?.noBorder) ? {noBorder :v.noBorder} : {}}/>
                        </View>
                    )
                })}
            </View>
            
        }
        </View>
     );
}
 
export default ModalContent;


const ContainerView = styled.View`
    background-color:white;
    border-radius:16px;
    padding:0px;
`;

const ChildrenView = styled.View`
  
    padding:16px;
    padding-top:0px;
`;

const IllustrationWrapperView = styled.View`
    width:100%;
    height:180px;
    background-color:transparent;
    margin-top:16px;
    margin-bottom:16px;
`;



        // <View style={{height:"80%",justifyContent:"center",alignItems:"center",padding:10}}>
        // {(illustration && illustrationPos == "top") &&
        //      <IllustrationWrapperView>
        //      {illustration}   
        //    </IllustrationWrapperView>
        // }
        // {title && 
        // <H1 style={{...titleStyle}}>{title}</H1>
        // }
        //  {(illustration && illustrationPos == "afterTitle") &&
        //     <IllustrationWrapperView>
        //     {illustration}   
        //   </IllustrationWrapperView>
        // }
        // {description && 
        // <P style={{marginTop:12}}>{description}</P>
        // }

        //  {(illustration && illustrationPos == "afterDescription") &&
        //    <IllustrationWrapperView>
        //      {illustration}   
        //    </IllustrationWrapperView>
        // }

        // {buttons &&
        //     <View style={{marginTop:(illustrationPos == "afterDescription")? 0 : 32}}>
        //         {buttons.map((v,i)=> {
        //             console.log("xx buttons",v)
        //             return (
        //                 <Button key={"popUpBtn_"+i} title={v?.label} onPress={v.callback} {...(v?.altStyle) ? {altStyle :v.altStyle} : {}} {...(v?.noBorder) ? {noBorder :v.noBorder} : {}}/>
        //             )
        //         })}
        //     </View>
            
        // }
        // </View>
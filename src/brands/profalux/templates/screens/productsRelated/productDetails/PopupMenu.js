import React, {useState} from "react";
import { Modal, TouchableOpacity, SafeAreaView, Text} from "react-native";
import { IconJSRender } from "../../../components/objects/common/IconJSRender";
import VuesaxBoldRecordCircle from '_brand/images/icons/app/VuesaxBoldRecordCircle';



export const PopupMenu = ()=>{
    const [visible, setVisible] = useState(false);
    const options = [
        {
            title:'Public',
            action: () => alert('Public')
        },
        {
            title:'Public',
            action: () => alert('Public')
        }
    ]

    return (
        <>
            <TouchableOpacity>
                <IconJSRender  
                    IconJSName = {VuesaxBoldRecordCircle}
                    iconId='kebab'
                    iconSize={40}
                    iconTitle ="kebab"
                    iconColor='white'
                    iconIsPressable={true}
                    //onIconPress = {handleIconPress}
                />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView 
                    style={{flex:1, backgroundColor:'yellow'}} 
                >
                        {
                            options.map( (op, i) =>{
                                <TouchableOpacity onPress={()=>op.action}>
                                    <Text>{op.title}</Text>
                                </TouchableOpacity>
                            })
                        }
                </SafeAreaView>
            </Modal>
        </>
    )
}








import React, { useState } from 'react';
import {View} from 'react-native';
import {ListItem} from 'react-native-elements';
import { useTranslation } from 'react-i18next';



export const ProductsList = ({list,chevron,doCheckBox,subtitleAvailable,...rest}) => {
  
    const { t, i18n } = useTranslation();
    const { selectionCallback} = rest;   

    const selectProductFamily = (id) => {
        
       // selectionCallback(id);
    }

    //-----------------------------------------------------------
    const RenderItem = (props) => {

        const { key,avatar_url,id, title, subtitle,selecProductCallback,chevron,checkBoxCallback,checkBox } = props; 
        const [isChecked, setIsChecked] = useState(false);

        const onCBPress = (e) => {
            const newVal = !isChecked;           
            setIsChecked(newVal);
        }
       
        const doOnPress = (checkBox) ?  false : ()=>{selectProductFamily(id) } ; 
        const renderCheckBox = (checkBox) ? {checked:isChecked,onPress:onCBPress} : false;

        return (
            <ListItem
                key={key} leftAvatar={{ source: { uri: avatar_url },rounded:false,fadeDuration:0}}
                transition={false}  title={title} chevron={chevron}  checkBox={renderCheckBox}               
                subtitle={subtitle}  onPress={doOnPress}   bottomDivider            
            />        
        )
    }
    //------------------------------------------------------------
    return (        
            <View>
                {
                    list.map((l, i) => {   

                        const showCheckBox = (doCheckBox) ? true : false;                       
                        return (
                            <RenderItem key={i} id={l.id} avatar_url ={l.avatar_url }               
                                        title={l.name} subtitle={l.shortDescription}
                                        selecProductCallback = {selectProductFamily}
                                        checkBox={showCheckBox} chevron={chevron}                
                            />
                            )
                        }
                    )                    
                }
            </View>
    )
}

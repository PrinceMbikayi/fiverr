import '_components/objects/doorKeeper/locales';

import React from 'react';
import {useContext,useState,useEffect} from 'react';
import {  View, Text,StyleSheet,Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-root-toast';
import { useNavigation,useRoute } from '@react-navigation/native';


import {useMimic} from '_hooks/mimic';
import { useTheme } from '_theming/themeProvider';
import { StyledHeaderView, H1Input, H1, DisconnectedViewOverlay, } from '../styled';
import { RightChevron } from '_components/ui/rightChevron';
import { PureItemRenderMenu } from '../menu';
import { noLevel2Access } from '_config/AppConfig';

const PureItemHeader = (props) => {


    const {netInfoIsConnected,uObject,listId,callbacks,modal,forceDisplay} = props;   
    const {objectDatas : itemDatas,connected} = uObject;    
    const {id : itemId,typeName,name : title,appName} = itemDatas;
    const  isApplication= itemDatas?.statusDictionary?.__app_id;

    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {};
    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();
   
    const {isTester,canDisguise} = useMimic();

    useEffect(() => {   
      // console.log("Menu params",props)
       
    }, []);

    const [titleEditable, setTitleEditable] = useState(false);
    const renameObjectEnabler =() => {
        setTitleEditable(true)
    }
   
    const titleModificationFieldBlur = () => {
        setTitleEditable(false)
    }

    const handleBlurCheck = async (text, params) => { 
        if(text == title) {
            setTitleEditable(false);
            return true;
        }
        console.log("handleBlurCheck",text)
        const res = await uObject.rename(text);
        const {errCode,errMsg} = res;
       
        if(errCode != 200) {
            let msg;
            switch (errMsg) {
                case "object_exists":
                    msg = t("addProduct:OBJECT_HAS_SAME_NAME", { 'name': text })
                    break;
                default:
                    msg = t("RENAME_ERROR");
                    break
            }
            Toast.show(msg, { position: Toast.positions.CENTER });
        }
        setTitleEditable(false);
       
    }

    const onBlur = () => {
        console.log("onBlur")
    }

    const expandMore = () => {
     
        if(route.name.indexOf("family")!=-1) {
            //console.log("uObject",uObject)
            navigation.navigate('familyDetails',{itemId:itemId,'inFamily':true});
        } else {
            navigation.navigate('ProductDetails',{itemId:itemId,typeName:typeName,appName:appName});
        }
    }
    
    const doManageComposite = () => {
      console.log("callbacks",callbacks)
    }

    
      const myAvailableCommands = {

        "renameObjectEnabler": renameObjectEnabler,   
        /*"manageComposite": doManageComposite,
        "manageDisguise" : this.manageDisguise,*/
      }
    
      const availableCommands = {...callbacks,...myAvailableCommands};
      //console.log("availableCommands",availableCommands)


    const level2Granted = (noLevel2Access.indexOf(typeName) == -1);
    //const forceDisplay = false;
    const borderRadius = 10;
    const inputColor = theme['card--color--text'];
    


    return (
        <StyledHeaderView bgColor={theme['card--color--headerbg'] || 'white'} style={{
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius
          }}>
            
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ alignContent: 'flex-start', width: 30 }}>
                <PureItemRenderMenu  callbacks={availableCommands} connected={connected} itemDatas={itemDatas} listId={listId} modal={modal}/>
              </View>
              <View style={{ alignContent: 'flex-start', flexGrow: 2, paddingLeft: 10, paddingRight: 10, flex: 1 }}>
                {(titleEditable == true)
                  ? <H1Input style={{ color: inputColor }} autoFocus onBlur={onBlur} onEndEditing={(event) => handleBlurCheck(event.nativeEvent.text)}>{title}</H1Input>
                  : <H1 style={{ textAlign: 'left', color: theme['card--color--headertext'] }}>{title}</H1>
                }
              </View>
              <View style={{ alignContent: 'flex-end', width: 30 }}>
                {((connected && level2Granted) || forceDisplay == true) &&
  
                  <RightChevron callback={expandMore} color={theme['card--color--text']} />
                }
              </View>
  
            </View>
            {((connected == false || !netInfoIsConnected)) &&
              <DisconnectedViewOverlay pointerEvents="none" bgColor={theme['card--color--deactivated-overlay'] || "#FF000088"} style={{ borderTopRightRadius: borderRadius, borderTopLeftRadius: borderRadius }} />
            }
          </StyledHeaderView>
    )
}

export default PureItemHeader
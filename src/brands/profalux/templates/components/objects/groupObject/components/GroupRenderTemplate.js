import React, {useEffect} from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation,useRoute } from '@react-navigation/native';

import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import PureItemHeader from './header';
import { StyledCardView, DisconnectedViewOverlay, DisconnectedText } from './styled'







const GroupRenderTemplate = (props) => {

  const {itemId,availableCommands,netInfoIsConnected,forceDisplay,typeDynamic} = props;
    //console.log("PureItemRender >>",props)
    //automatedTestId exists
    


    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
    //console.log("PureItemRender --------------->",itemId,props)
    const uObject = useObject(itemId);
    //console.log("PureItemRender ==============>",uObject)
    const {getId,objectDatas : itemDatas,execute} = uObject;   
    if(itemDatas?.flags?.hidden == true) return null;
    const {typeName,connected,statusDictionary : statuses} = itemDatas;
   

    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();
   
    

    useEffect(() => {   
      // console.log("Menu params",props)
       
    }, []);  
   
    
    const borderRadius = 10;


    return (
      <StyledCardView bodyBgColor={'transparent' || theme['card--color--bodybg'] || 'red'} style={{ borderRadius:10 }}>
          <PureItemHeader uObject={uObject} callbacks={availableCommands} netInfoIsConnected={netInfoIsConnected} forceDisplay={forceDisplay} />     
          <View>
            <>
           {typeDynamic}       
            {((connected == false || !netInfoIsConnected) && forceDisplay != true) &&
              <>
                <DisconnectedViewOverlay bgColor={theme['card--color--deactivated-overlay'] || "#FF000088"} style={{ borderBottomRightRadius: borderRadius, borderBottomLeftRadius: borderRadius }} />
                {(!connected && netInfoIsConnected) &&
                  <DisconnectedText>{t("OBJECT_DISCONNECTED")}</DisconnectedText>
                }
                {!netInfoIsConnected &&
                  <DisconnectedText>{t("NETWORK_IS_DECONNECTED")}</DisconnectedText>
                }
              </>
            }
            </>
         </View>
       </StyledCardView>
    )
}


export default GroupRenderTemplate




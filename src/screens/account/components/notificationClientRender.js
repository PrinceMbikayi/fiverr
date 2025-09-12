import React, {Fragment,useContext,useEffect,useState,useRef,useCallback} from 'react';
import { Text,View,Image,ScrollView,SafeAreaView} from 'react-native'; // use in styled components
import { useSelector,useDispatch } from 'react-redux';

import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import moment from 'moment/min/moment-with-locales';

import { useTheme } from '_theming/themeProvider';
import {getObjectById} from '_helpers/selectors';
import {executeAction} from '_api/Api';
import { AccountScreenLine } from './accountLine'; 
import { IconButton } from '_components/list/multiPurposeLine/iconButton';

export const PushClientRender = (props) => {

    const pushNotificationEnabled = () => {
        return ((""+itemDatas?.statusDictionary?.push) === 'on')
    }

    const {id : itemId, longPress,longPressDuration = 3,selected} = props;


    const itemDatas  = useSelector(state => getObjectById(state,itemId));    
    const [switchVal,setSwitchVal] = useState(pushNotificationEnabled);
    const [isCurrentMobile,setIsCurrentMobile] = useState(false)

    const { t, i18n } = useTranslation();
    const { theme} = useTheme();   

    let currentLang = i18n.language;
    if(currentLang == "en")currentLang+="-gb";
    moment.locale(currentLang); 
   
    
    const doSwitch = async() => {
        const newVal = !switchVal
        setSwitchVal(newVal);
        const strVal = (newVal) ? 'true' : 'false';
        console.log("newVal",newVal)
        //const params = {"mArgs": [{"name": "push","value": "true"}]}
        const resp = await executeAction(itemId,"SETUP",{mArgs:[{name:'push',value:strVal}]}); 
        console.log("resp",resp)

    }

    // exemple execute function if defined
    const doLongPress = (id) => {
       
        (longPress || Function)(itemId)
    }

    useEffect(() => {
        // force render
        let uniqueId = DeviceInfo.getUniqueId();
       // console.log("PushClientRender",itemDatas,uniqueId)
        setIsCurrentMobile(uniqueId == itemDatas?.realName)
    }, []);

    useEffect(() => {
        // force render
    }, [switchVal]);

    let os = (itemDatas?.statusDictionary?.OS || "nope") + '';
    if(os == 'ios') os = "apple"

    const lastSeen = itemDatas?.statusDictionary?._lastSeen || null;    
    const subTitle = (isCurrentMobile) ? null : (lastSeen)? moment(lastSeen).fromNow() :  null;
    //const icon = (!selected) ? "mobile"+((os)? ","+os:'') : "tick"
    const icon = (!selected) ? "mobile" : "tick";


    const IconLeft = (props) => {
        const {selected,iconSize = 24,bgColor = 'white',selectedBgColor = theme["greenValid"]} = props;
        
        const icons = icon.split(",");
        //const color = theme.onBody;
        const color = "black";
       
      
        return (
            <View style={{width:iconSize+4 ,height:iconSize+4,alignItems:'center',justifyContent:'center',marginRight:4}}>
            { icons.map((v,i)=> {
                    return (
                        <Fragment key={"nCrIcon_"+i}>
                            {(v!= undefined && 1 == 1) &&
                            <View style={{position:'absolute'}}>
                                 <IconButton icon={v} size={26} iconColor={!selected ? color : 'white'} backgroundColor={selected ? selectedBgColor : bgColor } />                                       
                            </View>                                   
                            }
                        </Fragment>
                    )
                })
            }     
            </View>
        )
    }
   



    return (
        <AccountScreenLine  iconLeft ={<IconLeft icon={icon} selected={selected} />}
                            title={itemDatas?.name} subTitle={subTitle} subTitleOpacity={0.4}
                            actionType="switch" callback={doSwitch} value={switchVal}
                            id={itemDatas?.id} 
                            active={isCurrentMobile}
                            longPress={doLongPress} 
                            delayLongPressDuration={longPressDuration}
                            enlarge={15}                          
                            selected={selected}
                            selectedBgColor="transparent"
                            switchActiveColor={theme["greenValid"] || "green"}

                            />

    )
}
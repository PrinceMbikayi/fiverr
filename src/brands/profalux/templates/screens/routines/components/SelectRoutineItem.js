import React from 'react';
import { Text, View, Pressable, Dimensions } from 'react-native';

import { iconsJs } from '_brand/utils/iconsJs';
import { getObjectById } from '_helpers/objects';
import { useTheme } from '_theming/themeProvider'
//import { useObject } from '_hooks/object';
import {extractParamFromEcoConfort} from '_brand/templates/screens/routines/utils/ecoConfortUtils'

const { width } = Dimensions.get('window')
export const SelectRoutineItem = (props) => {

  const { item, iconColor, callBack } = props;

  const uObject = getObjectById(item);
  const typeName = uObject?.typeName ? uObject?.typeName : "Extra";
  const routineName = uObject?.name
  const routineId = uObject?.id;

  const { theme } = useTheme();
  const textColor = theme?.prflxTextColor || 'black'

  let iconSize = typeName == "application" ? 55 : 40;
  let marginTop = typeName == "application" ? -8 : 0;

  console.log('GET_TYPE_NAME :', typeName);

  const getIcon = (typeName) => {
      let type;

      if(typeName != "Extra"){
          switch(typeName){
            case "Associations":
              type = "scenario"
              break;
            case "application":
              const appName = uObject?.appName;
              console.log('APP_NAME :', appName);
              if(appName == "Protection vent"){
                type =  "windProtection"
              }else{
                const parameters = uObject?.parameters ||[]
                type = extractParamFromEcoConfort(parameters, 'vr_season');
              }
              break;

            default:
              type = "scenario"
              break;
          }       
      }

    return type
  }


  const iconType ={
      "winter":{component : <iconsJs.ecoWinterIcon.name color={textColor}/>, iconSize:55},
      "summer":{component : <iconsJs.ecoSummerIcon.name color={textColor}/>, iconSize:55},
      "scenario": {component :<iconsJs.customRoutineIcon.name color={textColor}/>, iconSize:40},
      "windProtection":{component: <iconsJs.windSockIcon.name color={textColor}/>,iconSize:42},
    }


  const IconRender = ({ IconJS }) => {
    return (
      <View style={{ width: iconSize, height: iconSize }}>
        <IconJS color={iconColor} />
      </View>
    )
  }


  if (item == 'extra') return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 5, }}
        >

            <View 
            style={{ 
                  width: width * 0.46, height: width * 0.23, 
                  backgroundColor: 'transparent',paddingHorizontal: 15, 
                  justifyContent: 'center', alignItems: 'center', 
                  borderRadius: 10, 
                }}
            />
        </View>
      );

  let content;

  content = (
    <Pressable
      key={routineId}
      onPress={callBack}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 4, }}
    >
      <View style={{
              width: width * 0.46, height: width * 0.23, backgroundColor: 'white', justifyContent: 'center',
              borderColor: 'orange', borderWidth: 1, borderRadius: 10, paddingHorizontal: 15
            }}
          >

          <Text numberOfLines={1} ellipsizeMode='tail'
            style={{
              fontSize: 14, fontWeight: '400', backgroundColor: 'transparent',
              paddingBottom: 8, paddingHorizontal: 0, marginTop: 0, color: textColor
            }}
          >
            {routineName.split("/").join(" ")}
          </Text>
          {typeName &&
            <View style={{width:iconType[getIcon(typeName)]?.iconSize, height:iconSize, marginTop:marginTop}}>
              {iconType[getIcon(typeName)]?.component}
              {/* <IconRender IconJS={iconsJs.customRoutineIcon.name} /> */}
            </View>
          }

        </View>
    </Pressable>
  )

  return <View style={{ flex: 1, justifyContent: 'center' }}>{content}</View>

}    
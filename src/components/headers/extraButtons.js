import React from 'react';
import { View} from 'react-native';

import { HeaderButton } from './header-button';

const ExtraButtons = (props) => {

    const {options = [],title,color} = props;

       if(options.length == 0)return null;
       
      
      
        //console.log("options ScreenHeaderButtons",options)      
        return (
            <View style={{backgroundColor:'transparent', width:40,height:32,marginRight:15,alignItems:'center', alignContent:'center'}}> 
                <View style={{flex:1,justifyContent:'center'}}>
                { options.map((v,i) => {
                    return (
                      
                       <HeaderButton callback={v.action} img={v.icon} svgr={v.svgr} key={"hwb_"+title+"_"+i} fillColor={color} iconSize={24} />
                      
                    )
                })         
                }
                </View>
            </View>
        )       
    }

export default ExtraButtons
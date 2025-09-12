
import React, { useEffect } from 'react';
import { View, Text,TouchableWithoutFeedback} from 'react-native';

import {RightChevron} from '_components/ui/rightChevron';
import {ThumbnailButton} from './thumbnail';



 export const ArchivesGrid = (props) => {

    const {callback, items = [],title = "",titleCallback} = props; 
   
    const doCallback = (args) => {
        console.log("archiveGrid doCallback",args)
        if(callback)callback(args);
    }

    useEffect(() => {
        //console.log("items changed",items)
     }, [items]);

    const Boxes = ({myItems = [],itemCallback}) => {
     
        const size = 80;
        const doItemCallback = (args) => {          
            (itemCallback || Function)(args); 
        }

        return (            
            <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                <>
                {myItems.map((item, i) => {
                    const bgSource = item.thumb;
                    return (                    
                        <ThumbnailButton size={size} callback={doItemCallback} callbackArgs={item} type={item.type} bgSource={{uri:bgSource}} />                    
                        )
                    })
                }
           
            </>
            </View>           
        )
     }

    const doTitlePress = () => {
        console.log("doTitlePress !!! ")
        titleCallback();
    }

    const textColor= props?.titleStyle?.color || "green";

    return (
        <>
            {title != "" &&
           
                <TouchableWithoutFeedback disabled={titleCallback == undefined} onPress={doTitlePress}>
                    <View style={{flex:1,flexDirection:'row',padding:10}}>
                            <View style={{flex:2}}>
                                <Text style={[{fontSize:20,color:textColor},(props.titleStyle)?{...props.titleStyle}:{}]}>{title}</Text>
                            </View>
                            {titleCallback!=undefined &&
                                <RightChevron  color={textColor} callback={doTitlePress}/>
                            }
                        </View>
                </TouchableWithoutFeedback>
           
            }            
            <Boxes myItems={items} itemCallback={doCallback}/>
       </>
    )
 }
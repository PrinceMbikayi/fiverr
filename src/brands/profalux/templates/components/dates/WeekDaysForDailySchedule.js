import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Text,TouchableWithoutFeedback, StyleSheet} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native'

import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider';

/**
 * 
 * @param {Object} props 
 * @param {array} props.days
 * @param {function} props.callback
 * @param {boolean} [props.editable]
 * @param {boolean} [props.invertedColors]
 * @returns  week clickable(if needed) days horizontal list
 */
export const WeekDaysForDailySchedule = (props) => {

    const { t, i18n } = useTranslation();
    const {editable,days,callback,invertedColors} = props; 

    const {theme} = useTheme();
    //const textColor = invertedColors ? theme["schedule_widget_text_color"] || "#777" : theme["body_color_text"];
    const textSelectedColor = "white" //theme["screen--color--text--selected"]; 
    
    const testColor = theme?.onBody||'yellow';
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = invertedColors ? "white" : theme?.prflxTextColor||'black' 

    const reduceDays = (days) => {
        const retVal = days.reduce(function(r,v,i){
            let pos = v-2;
            if(pos == -1)pos=6
            r[pos] = true;
            return r;
        },[0,0,0,0,0,0,0]);
        return retVal;
    }

    let currentLang = i18n.language;
    if(currentLang == "en")currentLang+="-gb";
    moment.locale(currentLang);     
    const wd = moment.weekdays(true);
    const initDays = (days) ? reduceDays(days) : [0,0,0,0,0,0,0];
    
    const [weekDatas, setWeekDatas] = useState([...initDays]);
    const [active, setActive] = useState(false);

    const updateSelection = (index) => {
        setActive(index)
        console.log("MY CLICKED INDEX DAY:", index)
        if(editable) {           
            const arr = [...weekDatas];
            arr[index] = Number(!arr[index]);          
            (callback || Function)(arr,index)
            console.log("HERRRRRRR :::::", arr)
        } else {
            console.log("NOT EDITABLE")
            //setWeekDatas(arr)
        }         
    }
   
    useEffect(() => {        
                if(days) {
                    const newDays = reduceDays(days);
                    setWeekDatas(newDays)
                }                
            }, [days]);

    useEffect(()=> {
        //console.log("ZZZZZZZ :", weekDatas)
    },[weekDatas]);

    useEffect(()=> {
    
    },[active]);





    const shadow = {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.8,
        elevation: 8,
        shadowColor: '#000000',
    }


    const DaysList = () => {
        return (
            <>
            {
                    weekDatas.map((day, index) => {
                        const label = wd[index].substr(0,1);
                        const myKey = wd[index].toString()+'_'+label;
                        const activated = day;
                        //console.log("OUUUUUU : ", day)
                        return (
                            ////disabled={(editable != true)}
                            <TouchableWithoutFeedback key={myKey}  onPress={()=>updateSelection(index)}> 
                                <View 
                                    style={{
                                            width:30, height:30, borderRadius:15, justifyContent:'center', alignItems:'center',
                                            backgroundColor: (active != index ? "white" : textColor), 
                                                shadowColor: "#000",
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 5,
                                                },
                                                shadowOpacity: 0.34,
                                                shadowRadius: 6.27,
                                                elevation: 10,
                                            }}>
                                    <DayText 
                                        color={active != index  ? textColor : textSelectedColor}
                                    >

                                        {label.toUpperCase()}
                                    </DayText>
                                    
                                </View>
                                {/* <DayButton  active={day} style={{flex:1,aspectRatio:1}} borderColor = {invertedColors ? textSelectedColor : 'transparent'}>
                                    
                                </DayButton> */}
                            </TouchableWithoutFeedback>                      
                        )
                    }
                 )  
                }
            </>
        )
    }
    

    return (   
                 <DaysView >
                     <DaysList/>
                 </DaysView>
            
    )
}
/*   */

const buttonSize = 36;
const DaysView = styled.View`
                    flex: 1;
                    flex-direction:row;
                    align-items : center;
                    justify-content:space-between;
                
                `;

const DayButton =  styled.View`
                    padding:5px;
                    max-height:${buttonSize}px;
                    max-width:${buttonSize}px;
                    border-radius:${buttonSize/2}px;
                    border:2px solid transparent;
                   
                    justify-content:center;
                   
                    flex: 1;
                    ${({ active,borderColor }) => active && `
                         border-color: ${borderColor};
                        
                    `}
                
                `;
const DayText = styled.Text`
        align-content:center;        
        align-self:center; 
        font-weight:bold;
        color: ${props => props.color}; 
                
                `;

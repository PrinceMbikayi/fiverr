import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Text,TouchableWithoutFeedback } from 'react-native';

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
export const WeekDays = (props) => {

    const { t, i18n } = useTranslation();
    const {editable,days,callback,invertedColors} = props; 

    const {theme} = useTheme();
    const textColor = invertedColors ? theme["schedule_widget_text_color"] || "#777" : theme["body_color_text"];
    const textSelectedColor = theme["screen--color--text--selected"];   

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

    const updateSelection = (n) => {
        if(editable) {           
            const arr = [...weekDatas];
            arr[n] = Number(!arr[n]);          
            (callback || Function)(arr)
            setWeekDatas(arr);           
        } else {
            console.log('This Weekday is not Editable')
        }         
    }
   
    useEffect(() => {        
                if(days) {
                    const newDays = reduceDays(days);
                    setWeekDatas(newDays)
                }                
            }, [days]);

    const DaysList = () => {
        return (
            <>
            {
                    weekDatas.map((day, index) => {
                        const label = wd[index].substr(0,1);
                        const myKey = wd[index].toString()+'_'+label;
                        const activated = day;
                        return (
                            <TouchableWithoutFeedback key={myKey} disabled={(editable != true)} onPress={()=>updateSelection(index)}>
                                <DayButton  active={day} style={{flex:1,aspectRatio:1}} borderColor = {invertedColors ? textSelectedColor : 'transparent'}>
                                    <DayText color={!day ? textColor : textSelectedColor} >{label.toUpperCase()}</DayText>
                                </DayButton>
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

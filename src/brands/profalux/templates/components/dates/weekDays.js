import React from 'react';
import {useContext,useState,useEffect} from 'react';
import { View,Text,TouchableWithoutFeedback, StyleSheet} from 'react-native';

import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native'

import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider';
import {useScenario} from '_brand/templates/screens/routines/hook/useScenario'

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



     console.log('DAYS_INIT :', days);

    const {theme} = useTheme();
    const borderColor = theme?.prflxBorderColor||'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = invertedColors ? "white" : theme?.prflxTextColor||'black' 
    
    const textSelectedColor = textColor //theme["screen--color--text--selected"]; 

    const reduceDays = (days) => {
        const retVal = days.reduce(function(r,v,i){
            console.log("VVV :", v)
            let pos = v-2;
            if(pos == -1)pos=6
            r[pos] = true;
            return r;
        },[0,0,0,0,0,0,0]);
        console.log("RETVAL :", retVal)
        return retVal;
    }

    let currentLang = i18n.language;
    if(currentLang == "en")currentLang+="-gb";
    moment.locale(currentLang);     
    const wd = moment.weekdays(true);
    console.log("WD :", wd)
    const initDays = (days) ? reduceDays(days) : [0,0,0,0,0,0,0];
    
    const [weekDatas, setWeekDatas] = useState([...initDays]);

    const updateSelection = (index) => {
        console.log("MY CLICKED INDEX DAY:", index)
        if(editable) {           
            //const arr = [0,0,0,0,0,0,0];
            const arr = [...weekDatas];
            arr[index] = Number(!arr[index]);          
            (callback || Function)(arr,index)
            console.log("Hello ::::", arr)
            
            setWeekDatas(arr);           
        } else {
            console.log("NOT EDITABLE")
        }         
    }
   
    useEffect(() => {        
                if(days) {
                    const newDays = reduceDays(days);
                    setWeekDatas(newDays)
                }                
            }, [days]);

    useEffect(()=> {
        console.log("ZZZZZZZ :", weekDatas)
    },[weekDatas]);






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
                        console.log("OUUUUUU : ", index)
                        return (
                            <TouchableWithoutFeedback key={myKey}  onPress={()=>updateSelection(index)}> 
                                <View 
                                    style={{
                                            width:30, height:30, borderRadius:15, justifyContent:'center', alignItems:'center',
                                            backgroundColor: !day ? "transparent" : "white",
                                            borderColor:!day ? "transparent" : "orange",
                                            borderWidth:!day ? 0 : 1,
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
                                        color={!day ? textColor : textColor}
                                        fontWeight = {!day ? 400 : 700}
                                    >
                                        {label.toUpperCase()}
                                    </DayText>
                                    
                                </View>
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
        font-size:13;
        font-weight:${props =>props.fontWeight}
        color: ${props => props.color}; 
                
                `;

import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { View,TouchableWithoutFeedback,Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

//---------------------------------------------------------

import {heaterBasePrograms} from '_config/products/core'
import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';
import { useTheme } from '_theming/themeProvider';
import { RightChevron } from '_components/ui/rightChevron';
import {rangeToPercent} from '_helpers/heaterTools';




 const ProgramRange = (props) => {


    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();   

    const ranges = props.ranges || [];

    const headerBackgroundColor = theme["card--color--headerbg"];
    const headerTextColor = theme["card--color--text"];
    const textColor = theme["card--color--text"];
    const iconSize = 24;    
    const colorOnBlock = theme["program-heater-color-on-block"];

    const drawBar = (startTime,endTime,mode,index) => {
       
        const percentile = rangeToPercent(startTime,endTime);
       
        const blockColor = theme["program-heater-"+mode+"-color"] || 'brown';
        const icon = (domusIcons[heaterBasePrograms[mode].icon] != undefined) ?  heaterBasePrograms[mode].icon+'.svg' : "empty.svg";
        const iconSize = 22



        const touchRange = (index) => {
            console.log("touchRange",index)
        }

        return (
             
                <TouchableWithoutFeedback key={`BarBlockTouchable-${index}`} onPress={() => {touchRange(index)}}>
                    <BarBlock percent={percentile} key={`BarBlock-${index}`}>                    
                        <Bar barColor={blockColor}>                       
                            <PureIconRender size={iconSize} img={icon} fill={colorOnBlock} /> 
                        </Bar>
                        {(startTime != "00:00") &&
                            <TimeText color={textColor}>{startTime}</TimeText>
                        }
                    </BarBlock>
                </TouchableWithoutFeedback>
        )       
    }

    const buildRanges = () => {
       
        if(ranges.length == 0 || ranges == undefined) return null;
       
        return (
            ranges.map((val,index) => {
                    const start = val?.start;
                    const end  = val?.end;
                    const mode = (val?.mode != undefined) ? val?.mode : 'off';

                    if(start == undefined|| end == undefined || mode == undefined)return null; 
                    return (
                        drawBar(start,end,mode,index)                       
                    )
                }        
            )
        )
    }


    return (
        <>
        {
           buildRanges() 
        }
        </>
    )


 };

 const ProgramRangeMeoized = React.memo(ProgramRange, (props, nextProps)=> {
     
    if(props.ranges === nextProps.ranges) {
        // don't re-render/update
        //console.log("do not render")
        return true
    } else {
        //console.log("render ------- memo programRange")
    }
    
})

 export default ProgramRangeMeoized

 const BarBlock = styled.View`
    flex:${props => props.percent};
    padding:2px;    
`;

const Bar = styled.View`   
    
    background-color:${props => props.barColor || red};
    border-color:white;
    border-width:1px;
    height:40px;
    justify-content:center;
    padding-left:5px;
    overflow:hidden;
    z-index:2;
`;

const TimeText=styled.Text`
        font-size:8px;
        color: ${props => props.color || "#999"};
        margin-left:-14px;
`; 
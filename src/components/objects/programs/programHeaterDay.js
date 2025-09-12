import React from 'react';
import {useEffect,useState,forwardRef, useImperativeHandle} from 'react';
import { View,TouchableWithoutFeedback,Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';

//---------------------------------------------------------


import { useTheme } from '_theming/themeProvider';
import { RightChevron } from '_components/ui/rightChevron';


import ProgramRange from './programRange';
//==========================================================================

/**
 * Represents a Day Schedule for Heater.
 * @constructor
 * @param {Object[]} ranges - An array of heating time ranges
 * @param {string} ranges[].start -- format (HH:mm:ss)
 * @param {string} ranges[].end -- format (HH:mm:ss)
 * @param {string} ranges[].mode -- the modes defined for the object
 * @param {Number} dayId - The numeric Id of the edited Day.
 * 
 * @type {React.FC<Props>}
 */

 const ProgramHeaterDay = React.forwardRef((props, ref) => {

    const { t, i18n } = useTranslation();   
    const {theme} = useTheme();   
    const headerBackgroundColor = theme["card--color--headerbg"];
    const headerTextColor = theme["card--color--text"];
    const textColor = theme["card--color--text"];

    const {callback,dayId,typeName} = props;

    // REF methods can be called (useImperativeHandle)
    // here as default for design purposes when do ranges props exists
    
    

    const _ranges = props.ranges || [];
    const [ranges,setRanges] = useState(_ranges);
    const range_cb = props.range_cb;

    useImperativeHandle(ref, () => ({

        getAlert() {
          console.log("getAlert from Child called by parent");
        },
        toggle() {
            if(!modalVisible)  updateComponents()
            setModalVisible(!modalVisible);
        }
      }));

    // DID MOUNT
    useEffect(() => {
       // const _ranges = props.ranges || designRanges
        //setRanges(_ranges)
        
    }, []);
    // ITEM UPDATE
   
    useEffect(() => {
        //console.log("program heater day ranges changed",props.ranges)
        const _ranges = props.ranges || [];
        const prevRanges = JSON.stringify(ranges);
        const newRanges = JSON.stringify(props.ranges);
        //console.log("--> effect !!!")
        setRanges(_ranges);        
    }, [props.ranges]);

    /*
    useEffect(() => {
       console.log("ranges states for redraw purposes",JSON.parse(JSON.stringify(ranges)))
       
    }, [ranges]);
    */
    //--------------------------------------------- 

    const iconSize = 24;    
    const colorOnBlock = theme["program-heater-color-on-block"];



    const touchRange = (index) => {
        if(range_cb) {
            range_cb(index)
        }
    }

    


    const cb = () => {
        callback(dayId);
    }


    return (
        
        <Wrapper bgColor={headerBackgroundColor}>
            {!props.withChevron ?  <ProgramRange ranges={ranges}/>  :
                <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                    <View style={{flexGrow:1}}>
                        <View style={{flexDirection:'row'}}>
                           <ProgramRange ranges={ranges}/>
                        </View> 
                    </View>                    
                    <View style={{width:40,marginTop:-10,paddingLeft:10}}>                                    
                        <RightChevron callback={cb} style={{width:20}} color={textColor}/>
                    </View>     
                </View> 
            }
        </Wrapper>
    )
})

export default ProgramHeaterDay


//===================================================================

ProgramHeaterDay.propTypes = {
   
    callback: PropTypes.func,
  };

//------------------------------------------------------------------

const Wrapper = styled.View`
    flex-direction:row;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};
    background-color:${props => props.bgColor || "white" };
  
    padding:5px;    

`;
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

const Divider = styled.View`
   
    margin-top:${props => (props.height / 2 || 10)}px;
    margin-bottom:${props => (props.height / 2 || 10)}px;
    border-bottom-width:1px;
    border-bottom-color:${props => props.dividerColor || "white"};   

`;

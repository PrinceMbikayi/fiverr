import React,{ useContext,useEffect,useState} from 'react';
import { View} from 'react-native';
import { useTranslation } from 'react-i18next';
import {ButtonGroup} from 'react-native-elements';
import { useSelector } from 'react-redux';

import styled from 'styled-components/native';
import { useNavigation,useRoute } from '@react-navigation/native';
import { VictoryChart,VictoryLine,VictoryAxis, VictoryLabel } from "victory-native";
import {useIsMounted} from '_hooks/isMounted';
import {getGraphs} from '_api/objects';

import { useTheme } from '_theming/themeProvider';



 /**
 * @typedef {Object} Props
 *
 * @property {string} title
 * @property {Object} [close] - if specific action needed add action key to Object else Close is executed
 * @property {string} [color] - Text Color / default theme['drawer--color--text'];
 * @property {string} [bgColor] - theme['header--bg'] if not set
 * @property {bool} [noShadow] - hide shadow *
 * @property {bool} [backDoClose] - Go to previous Stack
 * 
 * 
 */

/**
 * Return Graph Component function component (FC)
 * 
 * @example
 * Usally used inside View
 *  <View style={{height:84,alignItems:'center',justifyContent:'center'}}>
       
    </View>
 * 
 * @type {React.FC<Props>}
 */
export const Graphs = (props) => {
   
    const {objectId,typeName, dataName} = props;


    
    const isMounted = useIsMounted();
    const { t, i18n } = useTranslation();
    const {theme} = useTheme();
    const navigation = useNavigation();
    const route = useRoute();
    const navigationParams = route?.params || {}; 
       
    const previousRoute = useSelector(state => state.app.previousRoute) ;

    const axisColor = theme?.prflxTextColor||'black'

    const borderColor = theme?.prflxBorderColor||'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor||'white';
    const bgcolor = theme?.prflxbgColor||'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor||"white";
    const textColor = theme?.prflxTextColor||'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'

    const extraLabelDependentAxis = {
        "temperature"   : "°C",
        "humidity"      : ' %'
    }

    const [displayDatas,setDisplayDatas] = useState(null)
    //const [dataName, setDataName] = useState('temperature')

    const reformatDatas = (variable) => {
        let arr = [];
        Object.keys(variable.map(item=> arr.push([item.timestamp, item.value])))
        return arr;
    }
    

    const reformatMockDatas = (datas) => {
        const result = datas.reduce((r,v,i) => {
        if(v[0]!= null)r.push({x:Date(v[0]),y:v[1]});
        return r
        },[])
        return result;
    }

    // Get the data from API
    const grabDatas = async() => {

        //console.log("typeName in grabDatas",typeName)
        if(typeName && typeName == "composite") {
            return false;
        }

        const requestResult = await getGraphs(objectId,'day').catch((error) => {console.log("grab graph error")});

        
        
        // if((isMounted && requestResult.errCode == 200) || mock == true)
        if((isMounted && requestResult.errCode == 200)){
         
            //const reformatedTemperature = reformattedMock;
            
            const temperature = reformatDatas(requestResult.res.temperature);
            
            const reformatedTemperature = {'temperature':reformatMockDatas(temperature)};
            console.log(" HAA DATA :", reformatedTemperature)

            //setDisplayDatas(reformatted)
            setDisplayDatas(reformatMockDatas(reformatedTemperature))
           
        }
        
    }
    
    useEffect(() => {
            grabDatas()
        
     }, []);
    useEffect(() => {
        
     }, [displayDatas]);

    const handlePress = async()=>{
        const requestResult = await getGraphs(objectId,'day').catch((error) => {console.log("grab graph error")});
       console.log("API DATA :", requestResult)
    }

    const interpolations = {
        NATURAL:"natural",BASIS:'basis',BUNDLE:"bundle",
        CARDINALE:"cardinal",LINEAR:'linear',MONOTONX:'monotoneX'
    
    }
const interpolation = interpolations.MONOTONX;


// DOMAIN 
const doDomain = (values) => {
        
    const minMax = values.reduce((r,v,i) => {
             //console.log("VVVVV",v.y)// each data point
             //console.log("RRRRR",r)// min and max of data set {min, max}
                 if(v.y < r.min)r.min = v.y;
                 if(v.y > r.max)r.max = v.y;
                 return r
         },{min:100000000000000,max:-100000000000})
         //domain={{x: [0, 100], y: [0, 1]}}
         //console.log("minMax",minMax)
         let delta = (minMax.max - minMax.min)/5;
         if(delta < 1)delta = 1;
         const domainYMin = Math.floor(minMax.min) - delta;
         const domainYMax = Math.ceil(minMax.max) +delta;
     
     return   {y:[domainYMin,domainYMax]}

}

    return(
        <View>
            <VictoryChart polar={false} height={390}  
     
            >
                                {/* Data plot */}
                                <VictoryLine
                                    // interpolate data to get a curve instead of a default line at origine
                                    interpolation={interpolation} data={displayDatas}
                                    //color of plot
                                    style={{ 
                                        data: { stroke: "#c43a31" },
                                        parent: { border: "1px solid #ccc"}
                                     }}
                                    domain={displayDomain}
                                    nolabels={datum => `${datum}`}
                                    nolabelComponent={<VictoryLabel y={250} verticalAnchor={"start"} />}
                                />
                                
                                {/* X axis */}
                                <VictoryAxis 
                                   tickCount ={6}
                                    tickFormat={(t) => {
                                            console.log("TTTTTT :",t)// is in millisecond
                                            const d = new Date(t);
                                            let tickText = "";
                                            switch('day') {
                                                case "day" : 
                                                    tickText = `${d.getHours()}h${d.getMinutes()}`                                   
                                                    //tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`                                   
                                                    break;
                                                // case "week" :
                                                //     tickText = `${addZero(d.getDate())}/${addZero(d.getHours())}h` ;     
                                                //     break;
                                                
                                                // case "month":
                                                //     tickText = `${addZero(d.getDate())}/${addZero(d.getMonth()+1)}` ;   
                                                //     break;
                                                // case 'year':
                                                //     tickText = `${addZero(d.getDate())}/${addZero(d.getMonth()+1)}` ;   
                                                // break;
                                            }
                                            return tickText
                                        }
                                    }
                                    style={{
                                        axis:{stroke: axisColor},tickLabels:{fill:textColor},
                                        grid: {
                                            fill: "none",
                                            stroke: 'lightgray',
                                            strokeDasharray: "10, 5",
                                            strokeLinecap :'round',
                                            strokeLinejoin : 'round',
                                            pointerEvents: "painted",
                                            strokeWidth: 1
                                          },
                                    }}
                                />
                                
                                {/* Y axis */}
                                <VictoryAxis dependentAxis
                                    tickFormat={(t) => `${Math.round(t*10)/10}`}
                                    style={{axis:{stroke: 'lightgray', strokeDasharray: "10, 5",strokeWidth: 1},tickLabels:{fill:textColor}}}
                                
                                />
                        </VictoryChart>
        </View>
    )
}
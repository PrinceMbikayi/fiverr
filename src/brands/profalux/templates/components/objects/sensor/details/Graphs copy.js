import React,{ useEffect,useState} from 'react';
import { View,Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import {ButtonGroup} from 'react-native-elements';
import { useSelector } from 'react-redux';

import styled from 'styled-components/native';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { VictoryChart,VictoryLine,VictoryAxis, VictoryLabel,VictoryVoronoiContainer,VictoryTooltip } from "victory-native";
import moment from 'moment/min/moment-with-locales';

import {useIsMounted} from '_hooks/isMounted';
import {getGraphs} from '_api/objects';

import { useTheme } from '_theming/themeProvider';
import {ShadowBorder} from '_components/ui/shadow-border'



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
   
    const {objectId,typeName} = props;


    
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

    //const displayedStatus = props.displayedStatus || Object.keys(props.datas)[0];
    const initialState = [];
    const [availableStatuses,setAvailableStatuses] = useState([])
    const [displayedStatus,setDisplayedStatus] = useState(null);    
    const [data,setData] = useState(initialState);
    const [rangeType,setRangeType] = useState(props.rangeType || "day")
    const [dataByRanges,setDataByRanges] = useState({});
    const [displayDatas,setDisplayDatas] = useState(null)
    const [displayDomain,setDisplayDomain] = useState({});
    
    const [alreadyHereDatas,setAlreadyHereDatas] = useState({});



    const grabDatas = async() => {

        //console.log("typeName in grabDatas",typeName)
        if(typeName && typeName == "composite") {
            return false;
        }

        const currentRangeType = ""+rangeType;
        //console.log("objectId",objectId,rangeType);
       
        const mock = false;

        const requestResult = mock ? {res:{}} : await getGraphs(objectId,rangeType).catch((error) => {console.log("grab graph error")});
        //const requestResult =  await getGraphs(objectId,rangeType).catch((error) => {console.log("grab graph error")});

        //console.log("requestResult","raw",requestResult.res,"reformatted",reformatDatas(requestResult.res))
         // ---- mock ------
        //const temperature =   [[1632614400000,22.25],[1633132800000,18.76],[1633651200000,19.25],[1634774400000,19.38],[1635292800000,16.44],[1636502400000,18.8],[1637020800000,18.56],[1637625600000,15.69],[1638144000000,17.28],[1638662400000,16.93],[1639180800000,14.06],[1639699200000,18.17],[1640217600000,16.68],[1640736000000,18.4],[1641254400000,18.97],[1641772800000,17.51],[1642291200000,14.16],[1642809600000,19.49],[1643328000000,13.94],[1643846400000,18.1],[1644364800000,18.39],[1644883200000,17.21],[1645401600000,16.86],[1645920000000,19.72],[1646438400000,19.37],[1646956800000,20.44],[1647475200000,20.66],[1647993600000,21.1],[1648512000000,22.54],[1649030400000,21.34],[1649548800000,20.04],[1650067200000,22.18],[1650585600000,21.23],[1651104000000,18.88],[1651622400000,22.73],[1652140800000,25.12],[1652659200000,24.04],[1653264000000,26.22],[1653782400000,23.91],[1654300800000,26.86],[1654819200000,24.15],[1655337600000,24.85],[1655856000000,27.73],[1656460800000,26.63],[1656979200000,27.21],[1657497600000,28.44],[1658016000000,25.67],[1658534400000,25.15],[1659052800000,25.43],[1659571200000,30.06],[1660089600000,27.9],[1660608000000,27.06],[1661126400000,22.14],[1661644800000,23.21],[1662163200000,25.51],[1662681600000,22.16],[1663200000000,24.31],[1663718400000,19.55]];
        //const reformattedMock = {'temperature':reformatMockDatas(temperature)};


         //console.log("mock reformatted",{'temperature':reformattedMock})
         
      
        //console.log("now ",requestResult);

        
        
        // if((isMounted && requestResult.errCode == 200) || mock == true)
        if((isMounted && requestResult.errCode == 200) || mock == true){
         
            //const reformatedTemperature = reformattedMock;
            console.log(" HAA DATA :", requestResult.res.temperature)

            const temperature = reformatDatas(requestResult.res.temperature);
            //const humidity = reformatDatas(requestResult.res.humidity);
            //const wind = reformatDatas(requestResult.res.wind_speed);

            const reformatedTemperature = {'temperature':reformatMockDatas(temperature)};
            // const reformatedHumidity = {'humidity':reformatMockDatas(humidity)};
            // const reformatedWind = {'wind':reformatMockDatas(wind)};

            //setDisplayDatas(reformatted)
            //setDisplayDatas(reformatMockDatas(temperature))

        //     console.log(" HAA DATA REFORMAT:", reformatedTemperature)// vide= [ [timestamp, value], [timestamp, value], .... ]

        //     // const reformatted = reformattedMock;
        //  console.log("REFORMATED HH :",reformatedTemperature)
            if(availableStatuses.length == 0) {
                const keys = (Object.keys(reformatedTemperature));
                setAvailableStatuses(keys);
                setDisplayedStatus(keys[0])
            }
        //    console.log("currentRangeType",currentRangeType)
           let refill = {...dataByRanges};
           refill[currentRangeType] = {values : reformatedTemperature};  
           
           console.log("Refill", refill)

            let _alreadyHereDatas = {...alreadyHereDatas}
            _alreadyHereDatas[rangeType] = refill;
            setAlreadyHereDatas(_alreadyHereDatas);
            setDataByRanges(refill);
           
        }
        
    }


    useEffect(()=>{
        console.log("SHOW DISPLAY DATA  !! :",Date.now(), displayDatas)

    },[displayDatas])



    const reformatDatas = (variable) => {
        let arr = [];
        Object.keys(variable.map(item=> arr.push([item.timestamp, item.value])))
        return arr;
    }
    

    const reformatMockDatas = (datas) => {
        const result = datas.reduce((r,v,i) => {
        if(v[0]!= null)r.push({x:new Date(v[0]),y:v[1]});
        return r
        },[])
        return result;
    }

   
    useEffect(() => {
        // mount
        if(typeName && typeName != "composite") {
            grabDatas(data)
        }
        
        return () => {
            // unmount
            console.log("cleaned up");
            console.log("objectId",objectId,rangeType)
          };
     }, []);

    // ATTENTION REDRAW

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



    useEffect(() => {
        console.log("dataByRanges !!!!!!!!!! ",rangeType,displayedStatus,dataByRanges);
       
       if(dataByRanges[rangeType] && dataByRanges[rangeType].values[displayedStatus]) {
            const valuesToShow = dataByRanges[rangeType].values[displayedStatus];
            console.log("Value To SHOW :", valuesToShow)
           /*
            const domain = doDomain(valuesToShow);
            setDisplayDomain(domain);
            */
            // mutated below but faster
            if(dataByRanges[rangeType].domains == undefined)dataByRanges[rangeType].domains={};
            dataByRanges[rangeType].domains[displayedStatus] = domain;
            
            setDisplayDatas(dataByRanges[rangeType].values[displayedStatus]);
            const domain = doDomain(valuesToShow);
            setDisplayDomain(domain);
       } else {
        setDisplayDatas(null);
       }
     }, [dataByRanges]);

     useEffect(() => {

        if(alreadyHereDatas[rangeType] != undefined) {  
            setDataByRanges(alreadyHereDatas[rangeType]);
        } else {
            grabDatas()
        }
        
     }, [rangeType]);
     
     useEffect(() => {
         if(dataByRanges[rangeType] != undefined && dataByRanges[rangeType].values != undefined) {
            
            let domain;
            if(dataByRanges[rangeType].domains[displayedStatus] == undefined) {
                domain = doDomain(dataByRanges[rangeType].values[displayedStatus]);
            } else {
                domain = dataByRanges[rangeType].domains[displayedStatus]
            }
           
            setDisplayDatas(dataByRanges[rangeType].values[displayedStatus]);
            setDisplayDomain(domain);
         }
        
     }, [displayedStatus]);
    
    const interpolations = {
                            NATURAL:"natural",BASIS:'basis',BUNDLE:"bundle",
                            CARDINALE:"cardinal",LINEAR:'linear',MONOTONX:'monotoneX'
                        
                        }
    const interpolation = interpolations.MONOTONX;
    
    const handleBackToPreviousScreen = () => {

        navigation.dispatch(StackActions.popToTop());
        //then go to previous Stack View
        if(previousRoute)navigation.navigate(previousRoute);   
        
      }

      const color = props.color || theme['drawer--color--text'];

        let month = new Array(12);
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

      const addZero = (value) => {
        let retVal = ""+((Number(value) < 10)? "0" : "");
        retVal+=value
        return retVal
      }
      //=============== RADIO GROUPS ============================
        const groupButtonStyle = { margin:5,height:30,borderRadius:15,borderColor:'transparent',borderWidth:0}
        const groupButtonContainerStyle = {backgroundColor:'transparent',borderColor:'transparent',border:'none'}
        const groupButtonSelectedButtonStyle = {backgroundColor:'blue' }
      //---------------- radio group button range ----------------
      const rangesTypes = ["day","week",'month',"year"];
      const rangesButtons = (fontSize) => {
        return rangesTypes.reduce((r,v,i) => {

            r.push ( <GroupButtonText  fontSize={fontSize}>{t("scenarios:"+v.toUpperCase())}</GroupButtonText>)
            return r
          },
          [])
      }
      const [selectedRangeIndex,setSelectedRangeIndex] = useState(0)

      const updateRangeIndex = (index) => {
          //console.log(index);
          setSelectedRangeIndex(index)
          setRangeType(rangesTypes[index])
      }
 
  
      // -------- radio group statuses --------------
      const statusesButtons = (fontSize) => {
          return availableStatuses.reduce((r,v,i) => {

            r.push ( <GroupButtonText  fontSize={fontSize}>{t("statuses:"+v)}</GroupButtonText>)
            return r
          },
          [])
      }
      const [selectedStatusIndex,setSelectedStatusIndex] = useState(0)
      const updateStatusIndex = (index) => {
        
        setSelectedStatusIndex(index)
        setDisplayedStatus(availableStatuses[index])
    }

    function HideAllIfNeeded(hProps) {
        //console.log("HideAllIfNeeded",hProps.typeName)
        if (!hProps.protypeName || hProps.typeName == "composite") {
           //console.log("so hide all")
          return null;
        }
      
        return (
          <></>
        );
      }

    const showNoDatas = () => {
       
        if(displayDatas && displayDatas.length == 0) {
            console.log("No data found")
            return (
                <Text style={{textAlign: 'center'}}>{t("GRAPH_NO_DATA")}</Text>
            )
            
        }
        return null;        
    }

    const doCursorLabel = (datum) => {
        
        const m = moment(new Date(datum.x))

        return m.format('DD/MM')+","+Math.round(datum.y)+"°C"
    }


    return (
       
        <View style={{marginTop:-20}}>
            
           {(typeName != 'composite') ?  
            <>
                {/* <ButtonGroup
                    onPress={updateStatusIndex}
                    selectedIndex={selectedStatusIndex}
                    buttons={statusesButtons(12)}
                    containerStyle={{backgroundColor:'transparent',borderColor:'transparent'}}
                    buttonContainerStyle={groupButtonContainerStyle}
                    buttonStyle={groupButtonStyle}
                    innerBorderStyle={{borderColor:'transparent'}}
                    selectedButtonStyle = {groupButtonSelectedButtonStyle} 
                    textStyle={{color:textColor}}               
                    /> */}
                <View style={{paddingLeft:35,paddingRight:15}}>
                    {
                        showNoDatas()

                    }
                        <VictoryChart polar={false} height={390}  containerComponent={
                                    <VictoryVoronoiContainer
                                        labels={({ datum }) => doCursorLabel(datum)}
                                        mouseFollowTooltips
                                        voronoiDimension="x"
                                        labelComponent={
                                            <VictoryTooltip  centerOffset={{ y: -75 }} pointerLength={0} constrainToVisibleArea />
                                        }
                                    />
                                }       
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
                                    tickFormat={(t) => {
                                            //console.log("TTTTTT :",t)// is in millisecond
                                        
                                            const d = new Date(t);
                                            let tickText = "";
                                            switch(rangeType) {
                                                case "day" : 
                                                    tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`                                   
                                                    break;
                                                case "week" :
                                                    tickText = `${addZero(d.getDate())}/${addZero(d.getHours())}h` ;     
                                                    break;
                                                
                                                case "month":
                                                case 'year':
                                                    tickText = `${addZero(d.getDate())}/${addZero(d.getMonth()+1)}` ;   
                                                break;
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
                                    tickFormat={(t) => `${Math.round(t*10)/10}${extraLabelDependentAxis[displayedStatus] || ""}`}
                                    style={{axis:{stroke: 'lightgray', strokeDasharray: "10, 5",strokeWidth: 1},tickLabels:{fill:textColor}}}
                                
                                />
                        </VictoryChart>
                </View>

                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <ButtonGroup
                        onPress={updateRangeIndex}
                        selectedIndex={selectedRangeIndex}
                        buttons={rangesButtons(12)}
                        containerStyle={{backgroundColor:'transparent',borderColor:'transparent',paddingHorizontal:10, width:350}}
                        buttonContainerStyle={groupButtonContainerStyle}
                        buttonStyle={groupButtonStyle}
                        innerBorderStyle={{borderColor:'transparent'}}
                        selectedButtonStyle = {groupButtonSelectedButtonStyle}
                        textStyle={{color:textColor}}
                    />
                </View>
            </>
                :
                <></>
            }
        </View>

    )

}


// Style && Theming 
const GroupButtonText = styled.Text`
                font-size: 13px;
                font-weight:400;
                text-transform:capitalize;
                
`;    

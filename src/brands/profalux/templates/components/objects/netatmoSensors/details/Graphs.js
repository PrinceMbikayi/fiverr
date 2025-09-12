import React,{ useEffect,useState} from 'react';
import { View,Text} from 'react-native';
import { useTranslation } from 'react-i18next';
import {ButtonGroup} from 'react-native-elements';
import { useSelector } from 'react-redux';

import styled from 'styled-components/native';
import { useNavigation,useRoute,StackActions } from '@react-navigation/native';
import { VictoryChart,VictoryLine,VictoryAxis} from "victory-native";
import moment from 'moment/min/moment-with-locales';

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
    const [myData, setMyData] = useState([]);
    const [myDomain, setMyDomain] = useState({});
    const [dataBound, setDataBound] = useState({});

    
    const [alreadyHereDatas,setAlreadyHereDatas] = useState({});



    const grabDatas = async() => {

        //console.log("typeName in grabDatas",typeName)
        if(typeName && typeName == "composite") {
            return false;
        }

        const currentRangeType = ""+rangeType;
        console.log("objectId",objectId,rangeType);

        const requestResult = await getGraphs(objectId,rangeType).catch((error) => {console.log("grab graph error")});

        
        
        // if((isMounted && requestResult.errCode == 200) || mock == true)
        if((isMounted && requestResult.errCode == 200)){
         
            //const reformatedTemperature = reformattedMock;
            console.log(" HAA DATA :", requestResult.res.temperature)

            const temperature = reformatDatas(requestResult.res.temperature);

            const reformatedTemperature = {'temperature':reformatMockDatas(temperature)};
            console.log("MY DATA VIEW :", reformatedTemperature);

            //setDisplayDatas(reformatted)
            //setDisplayDatas(reformatMockDatas(temperature))
            setDataByRanges(reformatedTemperature?.temperature)
            setMyData(reformatedTemperature?.temperature)

        //     if(availableStatuses.length == 0) {
        //         const keys = (Object.keys(reformatedTemperature));
        //         setAvailableStatuses(keys);
        //         setDisplayedStatus(keys[0])
        //     }
        // //    console.log("currentRangeType",currentRangeType)
        //    let refill = {...dataByRanges};
        //    refill[currentRangeType] = {values : reformatedTemperature};  
           
        //    console.log("Refill", refill)

        //     let _alreadyHereDatas = {...alreadyHereDatas}
        //     _alreadyHereDatas[rangeType] = refill;
        //     setAlreadyHereDatas(_alreadyHereDatas);
        //     setDataByRanges(refill);
           
        }
        
    }


    useEffect(()=>{
        console.log("SHOW DISPLAY DATA  !! :",Date.now(), displayDatas)

    },[displayDatas])

    useEffect(()=>{
        console.log("MY DATA  !! :", myData)
        retrieveTicks(myData)
        setMyDomain(domain(myData))
    },[myData])

    useEffect(()=>{
        console.log("MY DATA  !! :", myDomain)

    },[myDomain])

    useEffect(()=>{
        console.log("BOUND   :", dataBound)

    },[dataBound])



    const reformatDatas = (variable) => {
        let arr = [];
        Object.keys(variable.map(item=> arr.push([item.timestamp, item.value])))
        return arr;
    }
    

    const reformatMockDatas = (datas) => {
        const result = datas.reduce((r,v,i) => {
        if(v[0]!= null)r.push({x:v[0],y:v[1]});
        //if(v[0]!= null)r.push({x:new Date(v[0]*1000),y:v[1]});
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

     const domain = (values) => {
        
           const minMax = values.reduce((r,v,i) => {
                    //console.log("VVVVV",v.y)// each data point
                    //console.log("RRRRR",r)// min and max of data set {min, max}
                        if(v.y < r.min)r.min = v.y;
                        if(v.y > r.max)r.max = v.y;
                        return r
                },{min:100000000000000,max:-100000000000})
                setDataBound({min:minMax.min,max:minMax.max})
                let delta = (minMax.max - minMax.min)/7;
                if(delta < 1)delta = 1;
                const domainYMin = Math.floor(minMax.min) -delta ; // -delta
                const domainYMax = Math.ceil(minMax.max) + delta;
                // const domainYMin = Math.floor(minMax.min) -delta; // -delta
                // const domainYMax = Math.ceil(minMax.max) + delta;
            
            return   {y:[domainYMin,domainYMax]}

     }
     const doDomain = (values) => {
        
           const minMax = values.reduce((r,v,i) => {
                    //console.log("VVVVV",v.y)// each data point
                    //console.log("RRRRR",r)// min and max of data set {min, max}
                        if(v.y < r.min)r.min = v.y;
                        if(v.y > r.max)r.max = v.y;
                        return r
                },{min:100000000000000,max:-100000000000})
                setDataBound({min:minMax.min,max:minMax.max})
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
      const rangesTypes = ["hour","day","week",'month',"year"];
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

const dat = [
    {x: 1696932000, y: 20.848166666667414},
    {x: 1696942800, y: 22.056833333332595},
    {x: 1696953600, y: 23.457305555554417},
    {x: 1696964400, y: 22.40241666666684},
    {x: 1696975200, y: 21.24374999999972},
    {x: 1696986000, y: 20.599611111110857},
    {x: 1696996800, y: 20.103138888888424},
    {x: 1697007600, y: 19.20783333333231}//19.20783333333231
]

const [xTticks, setXTicks] = useState([]);
const [yTicks, setYTicks] = useState([]);

useEffect(()=>{
    console.log("X TICKS POINT :", xTticks)
},[xTticks])

useEffect(()=>{
    console.log("Y TICKS POINT :", yTicks)
},[yTicks])

const retrieveTicks = (data)=>{
    let xlst =[];
    let ylst =[];
    let max = 0;
    let min = 0;
    //ylst[-1]=30;
    data.map(item =>{
        xlst.push(item.x)
        ylst.push(Math.round(item.y))
        max = Math.round(item.y) > max ? Math.round(item.y) : max;
       min = Math.round(item.y) < min ? Math.round(item.y) : min;
    })
    setXTicks(xlst)
    setYTicks(ylst)
    //setYTicks([min-1,...ylst, max+1])
}

// const getMinMaxOfData = values.reduce((r,v,i) => {
//     // r ={x:value, y:value}
//         if(v.y < r.min)r.min = v.y;
//         if(v.y > r.max)r.max = v.y;
//         return r
// })


    return (
       <View>
            <VictoryChart polar={false} height={390}>
                <VictoryLine 
                    data={myData}  
                    domain={myDomain}
                    //domainPadding={{y: 30}}
                    //domainPadding={5}
                    interpolation={interpolation}
                    style ={{data: { stroke: "orange" }, }}
                />
                <VictoryAxis 
                    offsetX = {1}
                    tickValues={xTticks}
                    //tickCount={6}
                    tickFormat={(t) => {
                        const d = new Date(t*1000);
                        let tickText = '';
                        switch(rangeType){
                            case 'hour':
                                tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`;
                                break;
                            case 'day':
                                tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`;
                                break;
                            case 'week':
                                tickText = `${addZero(d.getDate())}/${addZero(d.getHours())}h` ; 
                                break;

                        }
                        return tickText
                    }}
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

                <VictoryAxis dependentAxis
                       //tickFormat={(t) => console.log("FORMAT :", t)}
                       //tickLabelComponent={<VictoryLabel dy={2}/>}
                       //offsetX={0}
                       tickValues={yTicks}
                       tickFormat={(t) => `${t}${extraLabelDependentAxis[displayedStatus] || ""}`}
                       //tickFormat={(t) => `${Math.round(t)}${extraLabelDependentAxis[displayedStatus] || ""}`}
                      style={{axis:{stroke: 'lightgray', strokeDasharray: "10, 5",strokeWidth: 1},tickLabels:{fill:textColor}}}
                />
            </VictoryChart>

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
       </View>
    )

}


// Style && Theming 
const GroupButtonText = styled.Text`
                font-size: 13px;
                font-weight:400;
                text-transform:capitalize;
                
`;    





// {/* <View style={{marginTop:-20}}>
            
// {(typeName != 'composite') ?  
//  <>

//      <View style={{paddingLeft:35,paddingRight:15}}>
//          {
//              showNoDatas()

//          }
//              <VictoryChart polar={false} height={390}  
//                  containerComponent={
//                          <VictoryVoronoiContainer
//                              labels={({ datum }) => doCursorLabel(datum)}
//                              mouseFollowTooltips
//                              voronoiDimension="x"
//                              labelComponent={
//                                  <VictoryTooltip  centerOffset={{ y: -75 }} pointerLength={0} constrainToVisibleArea />
//                              }
//                          />
//                      }       
//                  >
//                      {/* Data plot */}
//                      <VictoryLine
//                          // interpolate data to get a curve instead of a default line at origine
//                          interpolation={interpolation} data={displayDatas}
//                          //color of plot
//                          style={{ 
//                              data: { stroke: "#c43a31" },
//                              parent: { border: "1px solid #ccc"}
//                           }}
//                          domain={displayDomain}
//                          nolabels={datum => `${datum}`}
//                          nolabelComponent={<VictoryLabel y={250} verticalAnchor={"start"} />}
//                      />
                     
//                      {/* X axis */}
//                      <VictoryAxis 
//                          tickCount ={6}
//                          //tickValues={[2.11, 3.9, 6.1, 8.05]}
//                          tickFormat={(t) => console.log("TICK :", t)}
//                          // tickFormat={(t) => {
//                          //         //console.log("TTTTTT :",t)// is in millisecond
//                          //         const d = new Date(t);
//                          //         console.log('Time :', d)
//                          //         let tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`;
//                          //         //let tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`;
//                          //         // switch(rangeType) {
//                          //         //     case "day" : 
//                          //         //         tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`                                   
//                          //         //         //tickText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`                                   
//                          //         //         break;
//                          //         //     case "week" :
//                          //         //         tickText = `${addZero(d.getDate())}/${addZero(d.getHours())}h` ;     
//                          //         //         break;
                                     
//                          //         //     case "month":
//                          //         //         tickText = `${addZero(d.getDate())}/${addZero(d.getMonth()+1)}` ;   
//                          //         //         break;
//                          //         //     case 'year':
//                          //         //         tickText = `${addZero(d.getDate())}/${addZero(d.getMonth()+1)}` ;   
//                          //         //     break;
//                          //         // }
//                          //         return tickText
//                          //     }
//                          //}
//                          style={{
//                              axis:{stroke: axisColor},tickLabels:{fill:textColor},
//                              grid: {
//                                  fill: "none",
//                                  stroke: 'lightgray',
//                                  strokeDasharray: "10, 5",
//                                  strokeLinecap :'round',
//                                  strokeLinejoin : 'round',
//                                  pointerEvents: "painted",
//                                  strokeWidth: 1
//                                },
//                          }}
//                      />
                     
//                      {/* Y axis */}
//                      <VictoryAxis dependentAxis
//                          tickFormat={(t) => `${Math.round(t*10)/10}${extraLabelDependentAxis[displayedStatus] || ""}`}
//                          style={{axis:{stroke: 'lightgray', strokeDasharray: "10, 5",strokeWidth: 1},tickLabels:{fill:textColor}}}
                     
//                      />
//              </VictoryChart>
//      </View>

//      <View style={{justifyContent:'center',alignItems:'center'}}>
//          <ButtonGroup
//              onPress={updateRangeIndex}
//              selectedIndex={selectedRangeIndex}
//              buttons={rangesButtons(12)}
//              containerStyle={{backgroundColor:'transparent',borderColor:'transparent',paddingHorizontal:10, width:350}}
//              buttonContainerStyle={groupButtonContainerStyle}
//              buttonStyle={groupButtonStyle}
//              innerBorderStyle={{borderColor:'transparent'}}
//              selectedButtonStyle = {groupButtonSelectedButtonStyle}
//              textStyle={{color:textColor}}
//          />
//      </View>
//  </>
//      :
//      <></>
//  }
// </View> */}
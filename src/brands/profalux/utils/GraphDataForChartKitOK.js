import "./locales"
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useObject } from '_hooks/object';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useTheme } from '_theming/themeProvider';
import { SelectList } from 'react-native-dropdown-select-list'

import { getGraphs, getGraphsTimeSeries } from '_api/objects';
import { capitalize as lodashCapitalize, lowerCase as lodashLowerCase } from 'lodash'
import { MyButtonGroup } from '_brand/templates/components/ui/MyButtonGroup';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';
import { iconsJs } from '_brand/utils/iconsJs';

import {
    LineChart,
} from "react-native-chart-kit";
import { TextSize } from "victory-native";

export const GraphDataForChartKit = (props) => {

    const { itemId, onSelect, isProfaluxTempLightSensor = false } = props;
    const { theme } = useTheme();
    const { t, i18n } = useTranslation();
    const tns = "util";
    const navigation = useNavigation();

    const [typeGraph, setTypeGraph] = useState(1);
    const [defaultFeature, setDefaultFeature] = useState({});
    const [typeGraphList, setTypeGraphList] = useState([]);

    const [chartKitData, setChartKitData] = useState([]);
    const [rangeType, setRangeType] = useState("day")
    const [coeff, setCoeff] = useState(-1);
    const [active, setActive] = useState(2);
    const [errorDataMessage, setErrorDataMessage] = useState();
    const [dataMin, setDataMin] = useState(0);
    const [dataMax, setDataMax] = useState(0);
    const [unit, setUnit] = useState("");




    const screenWidth = Dimensions.get('window').width;


    const borderColor = theme?.prflxBorderColor || 'orange';
    const Containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'


    const buttons = [
        { id: 1, label: `${t(tns + ":" + "HOUR")}`, },
        { id: 2, label: `${t(tns + ":" + "DAY")}`, },
        { id: 3, label: `${t(tns + ":" + "WEEK")}`, },
        { id: 4, label: `${t(tns + ":" + "MONTH")}`, },
        { id: 5, label: `${t(tns + ":" + "YEAR")}`, },
    ]

    const UNITS = [
        { feature: 'temperature', unit: '°C' },
        { feature: 'illuminance', unit: 'lux' },
        { feature: 'humidity', unit: '%' },
        { feature: 'pressure', unit: 'Pa' },
        { feature: 'noise', unit: 'dB' },
        { feature: 'Co2', unit: 'ppm' },
        { feature: 'battery', unit: '%' },
        { feature: 'wind', unit: 'km/h' },
    ]

    const data = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
            {
                data: [0, 0, 0, 0, 0, 0, 0],
                color: (opacity = 1) => "orange", // optional `rgba(62, 73, 94, ${opacity})`
                strokeWidth: 2 // optional
            }
        ],
        //legend: ["Rainy Days"] // optional
    };

    const [myData, setMyData] = useState(data);

    useEffect(() => {
        console.log('VOIR_DATA : ', myData);
    }, [myData]);

    const addZero = (value) => {
        let retVal = "" + ((Number(value) < 10) ? "0" : "");
        retVal += value
        return retVal
    }

    const labelFormat = (timeStamp, range) => {
        const d = new Date(timeStamp);
        const fullyear = d.getFullYear().toString()
        const yearShort = fullyear.slice(-2);
        console.log(" HAA DATA LABELS :", timeStamp)
        let labelText = '';
        switch (range) {
            case 'hour':
                labelText = `${addZero(d.getHours())}h${addZero(d.getMinutes())}`;
                break;
            case 'day':
                labelText = `${addZero(d.getDate())}/${addZero(d.getHours())}h`//${addZero(d.getMinutes())}`;
                //console.log("CHECK LABEL :", d.getMonth())
                break;
            case 'week':
                labelText = `${addZero(d.getDate())}/${addZero(d.getMonth() + 1)}`// /${addZero(d.getHours())}h` ; 
                //labelText = `${addZero(d.getMonth()+1)}/${yearShort}` ; 
                break;
            case 'month':
                labelText = `${addZero(d.getMonth() + 1)}/${yearShort}`;
                break;
            case 'year':
                labelText = `${fullyear}`;
                break;
            default:
                labelText = `${addZero(d.getDate())}/${addZero(d.getHours())}h`;



        }
        return labelText
    }

    const organisedData = (labels, points) => {
        let buildLabel = [];
        labels.map(item => {
            const label = labelFormat(item, rangeType);
            buildLabel.push(label);
        })

        const data = {
            labels: buildLabel,
            datasets: [
                {
                    data: points.length != 0 ? points : [null],
                    color: (opacity = 1) => points.length == 0 ? "white" : "orange",
                    strokeWidth: 2 // optional
                }
            ],
            legend: points.length == 0 && ["No Data"]//["Rainy Days"] // optional
        };

        setMyData(data)
        console.log("OUUUPPPFFF DATA :", data)

    }


    // GET OBJECT DATA--------///
    const grabDatas = async (itemId, rangeType, coeff) => {
        console.log("BONJOUR !")
        //const requestResult = await getGraphs(itemId,rangeType).catch((error) => {console.log("grab graph error")});
        const requestResult = await getGraphsTimeSeries(itemId, rangeType, coeff).catch((error) => { console.log("grab graph error") });
        console.log(" HAA_DATA :", requestResult)
        if ((requestResult.errCode == 200)) {

            console.log(" HAA DATA :", requestResult.res)

            const testData = requestResult.res;

            console.log("TESSSSSST :", testData)
            const typeFeature = [];
            let index = 1;
            let tempListGraph = [];
            let tempChartKitData = [];
            for (const [key, value] of Object.entries(testData)) {
                console.log("KEY VALUE :", index, key, value)

                if (key != "battery") {

                    const typeGraph = { key: index, value: key }
                    console.log('VALUES_SPREAD:', ...value);
                    //let labels = [...value.map(i => i.timestamp * 1000)]
                    //let labels = [...value.map(i=> (new Date(i.timestamp*1000)).toLocaleDateString("fr") )]
                    //const points = [...value.map(i => i.value)]
                    let points = [];
                    let labels = [];

                    value.map((item)=>{
                        const myValue = (item?.value)? item?.value : item?.value
                        //const myValue = (item?.value)? Math.floor(item?.value) : item?.value
                        console.log('MY_VALUE :', myValue, item?.value);
                        const myX = (item?.timestamp)*1000
                        if(myValue != null || myValue != undefined){
                            points.push(myValue)
                            labels.push(myX)
                        }
                        console.log('VIDE :', value);
                    })

                    //console.log('MY_POINTS_AND_LABELS :', myLabels, myPoints);
                    
                    

                    let feature;
                    feature = { key: index, value: lodashCapitalize(key) }
                    // if (isProfaluxTempLightSensor) {
                    //     // remove battery as feature
                    //     if (key != "battery") feature = { key: index, value: lodashCapitalize(key) }
                    // } else {
                    //     feature = { key: index, value: lodashCapitalize(key) }
                    // }

                    const featureName = (feature.value).toLocaleLowerCase();
                    const maxValue =  points.length != 0 ? Math.max(...(points)) : "-- "
                    const minValue =  points.length != 0 ? Math.min(...(points)) : "-- "
                    // const maxValue =  points.length != 0 ? Math.floor(Math.max(...(points))) : "-- "
                    // const minValue =  points.length != 0 ? Math.floor(Math.min(...(points))) : "-- "

                    const typeLabelsPoints = { id: index, key: key, labels: labels, points: points, maxValue:maxValue, minValue: minValue }
                    organisedData(labels, points)
                    console.log("CHECK_INFINITY :", typeLabelsPoints)

                    typeFeature.push(feature)
                    console.log('Feature_Name :', featureName)
                    tempListGraph.push(typeGraph)
                    tempChartKitData.push(typeLabelsPoints)
                    index = index + 1

                }
            }

            setTypeGraphList(typeFeature)
            setChartKitData(tempChartKitData)// charger les data
            updateMinMax(tempChartKitData)
            console.log("C'EST QUOI CETTE VALEURE :", tempChartKitData)
            setErrorDataMessage()


            tempChartKitData.map(item => {
                console.log("CHARKIT DATA :", chartKitData)
                if (typeGraph == item.id) {
                    const data = organisedData(item.labels, item.points)
                    let featureUnit;
                    UNITS.map(item => {
                        if ((item?.feature).toLocaleLowerCase() == featureName) {
                            featureUnit = item?.unit;
                        }
                    })
                    setUnit(featureUnit)
                }
            })


        } else if (requestResult.errCode == 500) {
            setErrorDataMessage("Internal Server Error")
        }
    }
    ///-----------//////////


    // Dealing with data  from server
    useEffect(() => {
        grabDatas(itemId, rangeType, 0)
    }, []);




    useEffect(() => {

        const typeFeatures = [];

        if (chartKitData != 0) {

            chartKitData.map(item => {

                const feature = { key: item.id, value: lodashCapitalize(item.key) }
                typeFeatures.push(feature)
                // set default select feature
                if (item.id == 1) setDefaultFeature({ key: item.id, value: lodashCapitalize(item.key) });
            })
        }

        setTypeGraphList(typeFeatures)
        console.log("RANGETYPE :", typeFeatures)
    }, [chartKitData]);

    useEffect(() => {
        console.log("SET COEFF :", coeff)
    }, [coeff]);

    useEffect(() => {
        console.log("NEW RANGE TYPE :", rangeType)
        grabDatas(itemId, rangeType, -1);
    }, [rangeType]);

    useEffect(() => {
        console.log(" RANGETYPE SELECT FEATURE LIST :", typeGraphList)

    }, [typeGraphList]);

    useEffect(() => {

    }, [active]);

    useEffect(() => {
        console.log("default feature :", defaultFeature)
    }, [defaultFeature]);

    useEffect(() => {
        console.log("NO DATA :", errorDataMessage)
    }, [errorDataMessage]);

    useEffect(() => {

    }, [dataMin, dataMax]);

    useEffect(() => {

    }, [unit]);

    useEffect(() => {
        console.log("My TypeGraph ::::::XXXX", typeGraph)
    }, [typeGraph]);




    const goBackInTime = () => {
        console.log("YOU PRESS ME BACK:::")
        let count = coeff;
        setCoeff(coeff - 1)
        if (count <= 0) {
            count = count - 1
            setCoeff(count)
            grabDatas(itemId, rangeType, count)
            //updateMinMax(chartKitData)
        } else {
            setCoeff(-1)
            grabDatas(itemId, rangeType, -1)
            //updateMinMax(chartKitData)
        }

    }
    const goNextInTime = () => {
        let count = coeff;
        if (count < -1) {
            count = count + 1
            setCoeff(count)
            grabDatas(itemId, rangeType, count)
            //updateMinMax(chartKitData)
        } else {
            setCoeff(-1)
            grabDatas(itemId, rangeType, -1)
            //updateMinMax(chartKitData)
        }

    }



    const handleOnSelect = () => {
        console.log(" This option is selected :", typeGraph, chartKitData)
        grabDatas(itemId, rangeType, -1);// c'etait coeff a la place de -1.

        const typeFeature = [];

        chartKitData.map(item => {
            console.log("CHARKIT_DATA_XY:", chartKitData)
            if (typeGraph == item.id) {
                const data = organisedData(item?.labels, item?.points)
                console.log("ORGANISE_DATA:", chartKitData)

                const feature = { key: item?.id, value: lodashCapitalize(item?.key) }
                const featureName = (feature?.value).toLocaleLowerCase()||"co2";
                const points = item?.points.map(i => i.toFixed(1)); // get only one decimal
                console.log('SEE_POINTS : ', points);
                // const maxValue =  points.length != 0 ? Math.max(...(points)) : "-- "
                // const minValue =  points.length != 0 ? Math.min(...(points)) : "-- "
                const maxValue =  points.length != 0 ? Math.floor(Math.max(...(points))) : "-- "
                const minValue =  points.length != 0 ? Math.floor(Math.min(...(points))) : "-- "
                console.log('UKU :', maxValue, minValue);

                let featureUnit;
                UNITS.map(item => {
                    if ((item?.feature).toLocaleLowerCase() == featureName) {
                        featureUnit = item?.unit;
                    }
                })
                setUnit(featureUnit)


                //console.log(" FEATURE-NAME: ", featureName)
                console.log(" ( MIN, MAX ) = ", "(" + minValue + ",", maxValue + ")")
                setDataMin(minValue);
                setDataMax(maxValue);
                typeFeature.push(feature)
            }
        })
        setTypeGraphList(typeFeature)

    }


    const updateMinMax = (chartKitData) => {

        chartKitData.map(item => {
            console.log("CHARKIT DATA :", chartKitData)
            if (typeGraph == item?.id) {
                const points = item?.points.map(i => i.toFixed(1)); // get only one decimal
                const maxValue =  points.length != 0 ? Math.max(...(points)) : "-- "
                const minValue =  points.length != 0 ? Math.min(...(points)) : "-- "
                console.log('UKU2 :', minValue, maxValue);
                setDataMin(minValue);
                setDataMax(maxValue);
            }
        })
    }


    const onPressRangeType = (item) => {
        console.log("Button Pressed :", item)
        let range;
        switch (item.id) {
            case 1:
                range = "hour"
                setActive(1)
                break;
            case 2:
                range = "day"
                setActive(2)
                break;
            case 3:
                range = "week"
                setActive(3)
                break;

            case 4:
                range = "month"
                setActive(4)
                break;

            case 5:
                range = "year"
                setActive(5)
                break;

            default:
                range = "day"
        }
        setRangeType(range)
        setCoeff(-1)
        //grabDatas(itemId, range,-1);
    }



    const RenderGroupButton = () => {
        return (
            <View style={{ marginHorizontal: 0 }}>
                {!errorDataMessage &&
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                        <TouchableOpacity
                            onPress={goBackInTime}
                            style={{ width: 30, height: 25, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d7d7d9' }}
                        >
                            {/* <Text>Arrière</Text> */}
                            <View style={{ backgroundColor: 'transparent' }}>
                                <MultiPurposeWidgetLine
                                    isPressable={false}
                                    icons={[iconsJs.leftChevronIcon]}
                                    iconSize={15}
                                    iconWrapperStyle={{ backgroundColor: 'transparent' }}
                                />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={goNextInTime}
                            style={{ width: 30, height: 25, backgroundColor: 'white', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#d7d7d9' }}
                        >
                            <View style={{ backgroundColor: 'transparent' }}>
                                <MultiPurposeWidgetLine
                                    isPressable={false}
                                    icons={[iconsJs.rightChevronIcon]}
                                    iconSize={15}
                                    //onPress={goNextInTime}
                                    //onLongPress={goNextInTime}
                                    //active = {sendCurrentActive}
                                    iconWrapperStyle={{ backgroundColor: 'transparent' }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                }
                <MyButtonGroup buttons={buttons} onPress={onPressRangeType} isActive={active} />
            </View>
        )
    }



    const chartConfig = {
        backgroundGradientFrom: "white",
        backgroundGradientFromOpacity: 1,
        backgroundGradientTo: "white",
        backgroundGradientToOpacity: 1,
        color: (opacity = 1) => `rgba(62, 73, 94, ${opacity})`,// (255, 255, 255, ${opacity})
        strokeWidth: 1, // optional, default 3
        barPercentage: 0.5,
        decimalPlaces: 1, // remove decimal places in y label, default is 2
        //useShadowColorFromDataset: false, // optional
        propsForVerticalLabels: {
            fontSize: 10,
        },
        propsForBackgroundLines: {

        }
    };
    const RenderChart = () => {
        const datasets = myData?.datasets
        const dataToDeal = datasets[0]?.data
        const isDataNull = dataToDeal[0]
        console.log('MY_MY :', myData);

        return (
            <View style={{ backgroundColor: 'transparent', borderRadius: 10, margin: 0, transform: [{ rotate: '0deg' }] }}>
                {errorDataMessage ?
                    <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={{ fontSize: 22, fontWeight: '600', color: 'red' }}>{t(tns + ":" + "SERVER_ERROR")}</Text>
                    </View>

                    :
                    <>
                        {isDataNull == null ? 
                            <View style={{justifyContent:'center', alignItems:'center', backgroundColor:'transparent', height:100}}>
                                <Text style={{color:'red', fontSize:16, fontWeight:"600"}}>{t(tns + ":" + "NO_DATA_FOUND")}</Text>
                            </View>
                            :
                            <View style={{ paddingHorizontal:2, marginBottom: 0 }}>
                                <LineChart
                                    data={myData}
                                    width={screenWidth - 50}// was 40
                                    height={256}
                                    verticalLabelRotation={0}
                                    chartConfig={chartConfig}
                                    bezier
                                    yLabelsOffset={10}
                                    xLabelsOffset={0}
                                    segments={4} // 7 before : interval kind of step
                                    //horizontalOffset={5}
                                    fromZero={false}
                                    onDataPointClick={() => console.log("Hello data point")}
                                //style={{paddingTop:10, paddingRight:5,  marginLeft:0}}
                                />

                            </View>
                        }
                    </>

                }
                <RenderGroupButton />

            </View>
        )
    }

    return (
        <View style={{ alignItems: 'center', justifyContent: 'space-around', padding: 0, flex: 1,backgroundColor:"transparent" }}>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 14, fontWeight: '400', paddingHorizontal: 10 }}>{t(tns + ":" + "HISTORY")}</Text>
                    <View>
                        <SelectList
                            search={false}
                            setSelected={setTypeGraph}
                            data={typeGraphList}
                            boxStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, height: 45, width: 204 }}
                            dropdownStyles={{ backgroundColor: '#EDEDED', borderRadius: 12, width: 200 }}
                            //dropdownItemStyles = {{backgroundColor:'red'}}
                            //placeholder={"Select a gateway"}
                            defaultOption={defaultFeature}
                            onSelect={handleOnSelect}
                        />
                    </View>
                </View>

            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minWidth: 260, flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View>
                        <Image source={require('_brand/images/icons/app/plus.png')} style={{ width: 22, height: 22 }} />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 13, fontWeight: '400' }}>{t(tns + ":" + "MAX")}</Text>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>{dataMax} {unit} </Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View >
                        <Image source={require('_brand/images/icons/app/moins.png')} style={{ width: 22, height: 22 }} />
                    </View>
                    <View style={{ marginLeft: 20 }}>
                        <Text style={{ fontSize: 13, fontWeight: '400' }}>{t(tns + ":" + "MIN")}</Text>
                        <Text style={{ fontSize: 16, fontWeight: '700' }}>{dataMin} {unit}</Text>
                    </View>
                </View>
            </View>

            <View style={{ borderRadius: 10, marginTop: 20 }}>
                <RenderChart />
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    bodyWrapper: {
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 5,
        marginTop: 10,
    },
    groupIconWrapper: {
        flexDirection: 'row',
        backgroundColor: 'transparent'
    },
})

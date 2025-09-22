import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import { useDispatch, useSelector } from "react-redux";

import { useNavigation, useRoute } from '@react-navigation/native';

import { getAllObjects, getObjectsByTypeName, getObjectsVisible } from '_helpers/selectors';
import { setOrderedList } from '_services/storage';
import { useTheme } from '_theming/themeProvider';
import { GroupListWithShortCard } from './GroupListWithShortCard';

import GroupTemplateScreen from '_brand/templates/components/objects/groupObject/components/GroupTemplateScreen';
import { alphabeticSort } from '_brand/utils/alphabeticSort';



const ProfaluxGroupHomeScreen = (props) => {

    const { t, i18n } = useTranslation();
    const { theme } = useTheme();
    const dispatch = useDispatch();


    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {};



    const objectsVisible = useSelector(getObjectsVisible);
    //const compositeVisible = useSelector(getObjectsByTypes)["Composite"] || [];
    const compositeVisible = useSelector(state => getObjectsByTypeName(state, "composite")) || [];
    const allObjects = useSelector(getAllObjects);
    //console.log("VISIII :", objectsVisible);
    // Retrieve typename for each groupe inside objectVisible
    //const groupNames = objectsVisible.map((item,index) =>())
    const _listId = "all";

    const [objectsArray, setObjectsArray] = useState([]);
    const [loadedObjects, setLoadedObjects] = useState([])
    const [lightSwitchData, setLightSwitchData] = useState([])
    const [otherData, setOtherData] = useState([])

    useEffect(() => {
        console.log("FORCED_REDRAW", objectsVisible)
    }, [objectsVisible])

    useEffect(() => {
        console.log(" CHECK MY FILTER : ", compositeVisible)
    }, [lightSwitchData, otherData, compositeVisible])

    useEffect(() => {
        let halfItemList = [];
        let fullItemList = [];
        //console.log("FORCED REDRAW  CompositeVisible===>",compositeVisible)
        let listObjects;
        compositeVisible.map((item) => {
            //console.log("View each object in list :", item, allObjects[item]?.uniType);
            ["LightEzsp", "SwitchEzsp"].includes(allObjects[item]?.uniType) ? halfItemList.push(item) : fullItemList.push(item)
            //const itemData = useSelector(state => getObjectById(state,item))
        })
        console.log('GROUP_ITEMS :', halfItemList, fullItemList);
        setLightSwitchData(alphabeticSort(halfItemList));
        setOtherData(alphabeticSort(fullItemList));

        // Force refresh by using allObjects 
    }, [allObjects])


    useEffect(() => {
        const backHandlerSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
        return () => {
            backHandlerSubscription.remove();
            //console.log("je suis retiré")
        };
    }, []);

    const handleBackPress = () => {
        //console.log(navigation,navigation.isFocused())
        return navigation.isFocused(); // intercept event  mean no back  
    }




    const getIds = async (listId, nowObjectVisible) => {
        const addList = await setOrderedList(listId, nowObjectVisible);
        return addList;
    }


    const [active, setActive] = useState(false);
    //const itemId = useObject(item).objectDatas.id

    const handlePress = (uObject, item, index) => {
        console.log('Toggle pressed on object :', uObject);
        console.log(" Let's check the itemId :", item)
        console.log("INDEX :", index)
        //const  
        setActive(!active);
    }
    const bgColor = 'blue'

    const goBack = () => {

        navigation.goBack();
    }


    let timerRef = useRef(null)




    return (
        <GroupTemplateScreen withKebab={true}>
            <GroupListWithShortCard sourceHalfCard={lightSwitchData}
                sourceFullCard={otherData}
                listId={_listId}
            />
        </GroupTemplateScreen>

    )
};

export default ProfaluxGroupHomeScreen;


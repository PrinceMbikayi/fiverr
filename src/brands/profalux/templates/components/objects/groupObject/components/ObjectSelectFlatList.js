import React from 'react';
import {useContext,useState,useEffect} from 'react';
import {FlatList} from 'react-native';
import {useSelector,useDispatch} from "react-redux";
import { useTranslation } from 'react-i18next';


import { useNavigation,useRoute } from '@react-navigation/native';

import { useTheme} from '_theming/themeProvider'
import {getObjectsByTypes} from '_helpers/selectors';
import VuesaxOutlineWifi from '_brand/images/icons/app/VuesaxOutlineWifi';
import { RenderItem } from '_brand/templates/components/objects/groupObject/components/RenderItem';



const ObjectSelectFlatList = (props) => {
    
    const {itemsToProcess} = props;
    const { t, i18n } = useTranslation();
    const {theme } = useTheme();
    const dispatch = useDispatch();

    const [selectedItems, setSelectedItems] = useState([]);
    const [active, setActive] = useState(false);
    

    const navigation = useNavigation();
    const route = useRoute();
    const navParams = route?.params || {}; 

    //const objectsVisible = useSelector(getObjectsVisible);
    const objectsVisible = useSelector(getObjectsByTypes)["Shutter"];
    //console.log("VISIII :", objectsVisible);



    useEffect(() => {        
      }, [selectedItems]);
    // Add selected item to list of object to add to the group
      const addItem = (itemToAdd) => {
        const updatedItems = [itemToAdd, ...selectedItems];
        setSelectedItems(updatedItems);
      };

      // remove selected object
      const removeItem = (itemToRemove) => {
        const updatedItems = selectedItems.filter((item) => {
          return item !== itemToRemove;
        });
      
        setSelectedItems(updatedItems);
      };
    const handlePress = (uObject,item, index)=>{
        //console.log('Toggle pressed on object :', uObject);
       console.log(" Let's check the itemId :", item)
       if(selectedItems?.includes(item)){
        //filter to remove
        removeItem(item);
       }else{
            addItem(item);
       }

        //const  
        setActive(!active);
    }
     const bgColor = 'blue';
     const iconColor = 'white';

    console.log("SELECTYED ITEM :", selectedItems);



      return (
                <FlatList
                    data={objectsVisible}
                    renderItem={ ({item, index}) => (
                                <RenderItem 
                                    item={item} 
                                    index={index} 
                                    iconColor={iconColor}
                                    bgColor={bgColor} 
                                    handlePress={handlePress} 
                                    IconJS ={VuesaxOutlineWifi}  
                                />
                    )
                            }
                    keyExtractor={(item, index) => "key_"+item} 
                    numColumns={3}
                />
        )
};

export default ObjectSelectFlatList;


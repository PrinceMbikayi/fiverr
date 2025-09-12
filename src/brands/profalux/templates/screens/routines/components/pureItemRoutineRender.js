import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useMimic } from '_hooks/mimic';
import { useObject } from '_hooks/object';
import { useTheme } from '_theming/themeProvider';
import TypeDynamic from '_components/objects/@dynamics_brand/routines/index';

// full alias path in order to get brand Template if it exists
import PureItemRenderRoutineTemplate from '_components/list/pureItemRender/pureItemRenderRoutineTemplate.js';




const areEqual = (prevProps, nextProps) => {
  /*****************************
   * the component will be reRendered when 
   * objectDatas or widgetReferenceDatas will update
   * even if true is return
   * that's the expected behaviour
   */

  // REVOIR le pourquoi de ce test !
  const noReRender = (prevProps.modal === nextProps.modal);

  return true;

  if (prevProps.netInfoIsConnected !== nextProps.netInfoIsConnected) return false;
  return noReRender;
  // info : no render -> return true;
}


const PureItemRoutineRender = ({ name, ...props }) => {


  console.log("PureItemRender 222>>",props)
  //automatedTestId exists



  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};
  const { itemId, modal, netInfoIsConnected} = props;
  //console.log("PureItemRender --------------->",itemId,props)
  const uObject = useObject(itemId);
  //console.log("PureItemRender ==============>",uObject)
  const { getId, objectDatas: itemDatas, execute } = uObject;
  if (itemDatas?.flags?.hidden == true) return null;
  const { typeName, connected, statusDictionary: statuses, appName } = itemDatas;


  const { t, i18n } = useTranslation();
  const { theme } = useTheme();

  const { isTester, canDisguise } = useMimic();

  const forceTypes = ['No_ AtHomeVDP', 'No_AtHomeLight'];
  const forceDisplay = (forceTypes.indexOf(typeName) != -1);

  useEffect(() => {
    // console.log("Menu params",props)

  }, []);

  useEffect(() => {
    //console.log("useEffect modal changed",itemId,modal)
    // just redraw
  }, [modal]);

  const borderRadius = 10;

  //--------------------------------
  const expandMore = () => {

    if (route.name.indexOf("family") != -1) {
      //console.log("uObject",uObject)
      navigation.navigate('familyDetails', { itemId: itemId, 'inFamily': true });
    } else {
      navigation.navigate('ProductDetails', { itemId: itemId, typeName: typeName, appName: appName });
    }
  }


  //--------------------------------
  const manageComposite = () => {
    // display Composite Components  
    //this.compositeRef.current.toggle();
    openModal(itemId, 'composite')
  }
  /*
    const  manageDisguiseTrue = () => {
      console.log("disguise !!!")
      this.disguiseRef.current.toggle()
    }
    */

  const manageDisguise = () => {
    console.log("disguise !!!")
    openModal(itemId, 'disguise')
  }

  const openModal = (itemId, type) => {
    // be careful modal is a ref
    console.log("modal", modal, "props", props)
    if (modal) {
      modal.current.toggle(itemId, type);
    }
  }
  const availableCommands = {
    "manageComposite": manageComposite,
    "manageDisguise": manageDisguise
  }



  const getTypeDynamic = () => {
    return (<TypeDynamic type={typeName} itemId={itemId} uObject={uObject} isRoutine={isRoutine}/>)
  }

  console.log("IS_ROUTINE_YO :", isRoutine)

  /**
   * @param {object} props
   * @param {string} props.destination
   * @param {object} props.params
   */
  const goSettings = (props) => {

    const { destination, params } = props;
    navigation.navigate('ProductSettings', { 'typeName': typeName, 'itemId': itemId })

  }

  const isRoutine = props.isRoutine;

  return (
    <PureItemRenderRoutineTemplate {...{ itemId, availableCommands, netInfoIsConnected, forceDisplay, isRoutine:isRoutine, typeDynamic: getTypeDynamic(), 'goLevel2': expandMore, 'goSettings': goSettings }} />
  )
}

/**
 * @typedef PropertiesHash
 * @type {object}
 * @property {string} id - an ID.
 * @property {string} name - your name.
 * @property {number} age - your age.
 */

const Exp = React.memo(PureItemRoutineRender, areEqual);
export default Exp




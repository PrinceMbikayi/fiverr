import {HeaderWithBack} from '_components/headers/header-with-back';
import React from 'react';
import {useState, useEffect} from 'react';
import {View} from 'react-native';
/*
import InfoCircle from '_images/icons/app/InfoCircleR';
import Close from '_images/icons/app/CloseCircle';
*/
/**
 *
 * @param {object} props
 * @param {string} props.title
 * @param {boolean} props.goBack
 * @param {boolean} [props.showInfos]
 * @returns <JSX>
 */
const ScreenHeader = props => {
  //console.log("ScreenHeader",props)
  const {title, goBack, showInfos, closeAction} = props;
  const [headerConfig, setHeaderConfig] = useState({noBack: true});
  
  
  const applyExtraButtons = () => {
    /*
    const newExtraButtons = [];
    if (showInfos) {
      newExtraButtons.push({action: showInfos, svgr: <InfoCircle />});
    }

    if (closeAction) {
      newExtraButtons.push({action: closeAction, svgr: <Close />});
    }

   // setExtraButtons({extraButtons: newExtraButtons});
    //console.log("newExtraButtons",newExtraButtons)
    return {extraButtons: newExtraButtons}
    */
   return {}
  }
  
  
  
  const [extraButtons, setExtraButtons] = useState(applyExtraButtons());





const doNewConf = () => {
  const newConf = {
    backSVG: goBack ? true : false,
    goBack: goBack ? {action: goBack} : false,
    noBack: goBack ? false : true,
  };

  setHeaderConfig(newConf);
}



  useEffect(() => {
    //console.log("ufx",props)
   doNewConf()
   
  }, []);

  useEffect(() => {
    console.log("++++++ headerConfig ++++++ changed",headerConfig)
  }, [headerConfig]);

  useEffect(()=> {
    console.log("goBack in screen Header",props);
    doNewConf()
  },[goBack]);

  useEffect(()=> {
   // refresh needed so... // console.log("so redraw extraButtons",extraButtons)
  },[extraButtons]);
  return (
    <View style={headerStyle}>
      <HeaderWithBack
        title={title}
        {...headerConfig}
        {...extraButtons}
        centered
        noShadow
        bgColor="transparent"
      />
    </View>
  );
};

export default ScreenHeader;

const headerStyle = {
  height: 64,
  backgroundColor: 'transparent',
  alignItems: 'center',
  justifyContent: 'center',
};

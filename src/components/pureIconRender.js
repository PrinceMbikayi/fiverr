import React, { useState,useEffect,useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import {SvgCss} from 'react-native-svg';

import styled from 'styled-components/native';
import {useIcon,getStatusesIcons} from '_hooks/icon';

//--- Appium -----
import {buildTestId} from '_helpers/appium';

/**
 * 
 * @param {Object} props
 * @param {string} props.img - a filename i.e. light.svg
 * @param {number} [props.size] - icon size
 * @param {string} [props.fill] - the color of the icon
 * @param {boolean} [props.appIcon] - get icon from appIcon default false * 
 * @param {boolean} [props.imageIsStatus]
 * @param {array} [props.activeStatusesImages] 
 * 
 * @return return the object icon + its statuses icons
 */
const PureIconRender = (props) => {

// good example of rename and assign defauklt value while destructuring
const { img,greenOn,
        size : iconSize  = 24,
        appIcon = false,
        color = "#000000",
        imageIsStatus = false,
        activeStatusesImages = [],
        fill : fillColor = "#000000",       
      } = props;

const iconName = (img?.indexOf(".") == -1 ) ? img : img?.substr(0, img?.lastIndexOf("."));
const objectIcon = useMemo(()=> useIcon(iconName,appIcon,imageIsStatus,activeStatusesImages)) || "";
const statusesIcons =  useMemo(()=> getStatusesIcons(activeStatusesImages),[activeStatusesImages] ) || [];

useEffect(()=> {
  //console.log("color,fillColor need update",color,fillColor)
},[color,fillColor])



  return  (
    
        <StyledIconWrapper width={iconSize} height={iconSize}>
          <>
            { (img?.indexOf('.png') ==-1 ) ?
              <SvgCss xml={objectIcon} width="100%" height="100%"  fill={fillColor} style={styles.icon} viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice"/>
            : null
            }
          {
           
            activeStatusesImages.map((status,index) => {                     
                      const statusColor = (greenOn && status?.indexOf("_on")!=-1) ? greenOn : fillColor;
                      const statusID = buildTestId("status_"+status);
                      if(status != undefined) {
                        return <SvgCss key={`status-${status}-${index}`} xml={statusesIcons[status]} width="100%" height="100%" viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice" fill={statusColor} style={styles.icon} {...statusID}/>                          
                      }
                    }
              )
          } 
          </>
      </StyledIconWrapper>
   
  )
  
}

export default PureIconRender

// ------------- STYLES -------------
const StyledIconWrapper = styled.View`
                         
                `;

const styles = StyleSheet.create({
  iconWrapper: {
    height:90,
    width:90,
   
  },
  icon: {
    position: "absolute", 
    left: 0,
    right: 0,
    alignItems: "center",
    
  }
});
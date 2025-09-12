// PAS VRAIMENT UN HOOK plus un helper

import { domusIcons,domusIconsStatuses} from '_assets/icons/domusIcons'
import { appIcons } from '_assets/icons/appIcons';
import {useAppGlobal} from '_helpers/appGlobalProvider';


const  emptySvg = '<svg  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" preserveAspectRatio="xMinYMin slice">';

/**
 * Return icon's SVG datas
 * @param {string} iconName 
 * @param {boolean} [appIcon] 
 * @param {boolean} [isStatus] 
 * @returns {string}
 */
export const useIcon = (iconName,appIcon,isStatus) => {   
           
    //console.log("useIcon",iconName,appIcon,isStatus)

        let ret =  appIcons[iconName] || domusIconsStatuses[iconName] || domusIcons[iconName];

        /*
        let ret = (appIcon) ? appIcons[iconName] : (isStatus) ? domusIconsStatuses[iconName] : domusIcons[iconName]; 
        if(!ret)ret = domusIcons[iconName];
        if(!ret)ret = domusIconsStatuses[iconName];
        */
        const svg = ret || emptySvg;       
        return  svg;       
  }

  export const getStatusesIcons = (activeStatusesImages) => {      
    
    const getStatusIcon = (status) => {
        return domusIconsStatuses[status]
    }

    const ret = activeStatusesImages.reduce((r,v,i) => {       
        if(v == undefined)return r;         
        const status = v.split('.')[0];           
        r[v] = (getStatusIcon(status) || emptySvg);
        return r
    },[])      
    return ret;
}


export const getObjectIcon = (itemDatas) => { 

    const {getObjectsMap} = useAppGlobal();
    const loadedConfig = getObjectsMap(); 
    const typeChecked = itemDatas.uniType  || itemDatas.typeName;  
    const myTypeName = loadedConfig?.products?.[typeChecked]?.mapTo || typeChecked;
    let retVal = (domusIcons[myTypeName] != undefined) ? myTypeName + '.svg' : itemDatas.img;
    return retVal;

}
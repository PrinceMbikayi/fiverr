import {fillSnapshot} from './settings';
import {updateDefaultImage} from '_actions/objects';


export const getImage = async(itemId,image) => {
    const default_image = require('../assets/default-image.png');
    const snap = await fillSnapshot(itemId);
    //console.log("hep hep snap",itemId,snap)
    //const snap = "https://detoximix.com/wp-content/uploads/2021/02/Mini-soup-blender-detoximix-1-640x480-1.jpg";
   
    const retImage = ((snap == 'default')? default_image : {uri:snap});
    return retImage;
    
  }

  /**
   * 
   * @param {*} itemId 
   * @param {*} value 
   * @param {*} dispatch 
   */
  export const setImage = (itemId,value,dispatch) => {
    dispatch(updateDefaultImage(itemId,value));
  }


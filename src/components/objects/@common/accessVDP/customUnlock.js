import React, {useEffect,useState} from 'react';
import {Text} from 'react-native';
import SlideToUnlock from '_components/ui/mySlideToUnlock';

/**
 * @param {Object} props 
 * @param {function} props.callback
 * @param {number} [props.itemId] only needed when callback need a distinctive objet reference
 * @param {string} [props.iconThumb]
 * @param {number} [props.thumbSize]
 * @param {number} [props.borderSize]
 * @param {string} [props.startColor]
 * @param {string} [props.endColor]
 * 
 * @returns JSX
 */
export const CustomUnlock = (props = {}) => {
    
   
    const {enabled} = props;
    //console.log("CustomUnlock",props)
    const defaultProps = {
            iconThumb:'gate',
            imageRight:'padlock',
            thumbSize:60,
            borderSize:4,
            startColor:"#c2c2c2",
            endColor:"#c2c2c200"
    }

    const merged = {...defaultProps,...props};

    //console.log("CustomUnlock merged",merged)
    useEffect(() => {
       
        if(enabled != redraw){
            setRedraw(enabled)
        }
    }, [enabled,merged?.itemId]);

    useEffect(() => {
     
    }, [props.itemId]);

    const [redraw,setRedraw] = useState(enabled)

    return (
        <SlideToUnlock  {...merged} enabled={enabled}/>
    )
}
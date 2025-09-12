import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

/**
 * 
 * @param {object} props
 * @param {string} props.name 
 * @param {number} props.size 
 * @param {string} props.color
 * @returns 
 */
export const MaterialIcon= ({name : iconName,size = 40,color}) => {   
       
    return  (
        <Icon name={iconName} size={size} color={color}/>
    );
}

import React from 'react';

import PureIconRender from '_components/pureIconRender';
import styled from 'styled-components/native'

export const TypeDefaultDetails= (props) => {
   
    const iconSize = 64;

    console.log("TypeDefaultDetails >>>>>>>",props)

    return (
            <StyledMainView>               
                <StyledIconWrapperView size={iconSize+20}>                
                    <PureIconRender size={iconSize} img={props.newIcon} fill="#ff0000"/>                    
                </StyledIconWrapperView>
            </StyledMainView>
    )
}
/**
 * @component
 * @attr {number} size
 * 
 */
const StyledMainView = styled.View`
                    flex: 1;
                    border-color:yellow;
                    border-width:2px;
                    min-height:150px;
                   
                `;
const styledDefaultProps = {
    iconWrapperSize:72
}
/**
 *
 * @attr {number} size
 * 
 */
const StyledIconWrapperView = styled.View`
                    position:absolute;                    
                    width: ${props => props.size || styledDefaultProps.iconWrapperSize}px;
                    height: ${props => props.size || 72}px;                   
                    left:50%;
                    top:50%;
                    margin-left:-${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    margin-top:-${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    border-radius:${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    background-color:#0000FF00;
                    align-items:center;
                    justify-content:center;

                `;


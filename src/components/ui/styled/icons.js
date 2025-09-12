

import styled from 'styled-components/native'

const styledDefaultProps = {
    iconWrapperSize:120,
    backgroundColor:'transparent'
}




export const StyledIconWrapperView = styled.View`
                    position:absolute;                    
                    width: ${props => props.size || styledDefaultProps.iconWrapperSize}px;
                    height: ${props => props.size || styledDefaultProps.iconWrapperSize}px;             
                    left:50%;
                    top:50%;
                    margin-left:-${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    margin-top:-${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    border-radius:${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
                    background-color:${props => props.backgroundColor || styledDefaultProps.backgroundColor};
                    align-items:center;
                    justify-content:center;

                `;
export const StyledIconWrapperBlockView = styled.View`
                     
        width: ${props => props.size || styledDefaultProps.iconWrapperSize}px;
        height: ${props => props.size || styledDefaultProps.iconWrapperSize}px;  
        border-radius:${props => props.size/2 || styledDefaultProps.iconWrapperSize/2}px;
        background-color:${props => props.backgroundColor || styledDefaultProps.backgroundColor};
        align-items:center;
        justify-content:center;

`;
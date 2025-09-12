import styled from 'styled-components/native'

export const HSeparator = styled.View`
margin-top:${props => (props.height / 2 || 10)}px;
margin-bottom:${props => (props.height / 2 || 10)}px;
border-bottom-width:1px;
border-bottom-color:${props => props.dividerColor || "white"};
${({ fat }) => fat && `
    border-bottom-width:2px;
`}

`;
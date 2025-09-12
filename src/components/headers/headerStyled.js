import styled from 'styled-components/native';

const StyledHeaderView = styled.View`
    background-color:${props => props.bgColor || 'green'};
    flex-direction:row;
    max-height:64px;
    align-items:center;
   
             
`;
const StyledMenuBurger = styled.Image`
    width:90px;
    margin-left:-20px;   
    height:64px;               
`;
const StyledTitle = styled.View`
    flex-grow:1;
    width: 0;
    color:white;
    margin:20px;
    display: flex;    
    justify-content: flex-start;
    
`;
const H1 = styled.Text`
    color:${props => props.color || "white" };
    font-weight:bold;
    font-size:20px;
    height:32px;
`;

export {StyledHeaderView,StyledMenuBurger,StyledTitle,H1}
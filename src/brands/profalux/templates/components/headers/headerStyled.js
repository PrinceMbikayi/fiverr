import styled from 'styled-components/native';

const StyledHeaderView = styled.View`
    background-color:${'green' || (props => props.bgColor || 'green')};
    flex-direction:row;
    max-height:64px;
    align-items:center;
    flex:1;
   
             
`;
const StyledMenuBurger = styled.Image`
    width:90px;
    margin-left:-20px;   
    height:64px;               
`;
const StyledTitle = styled.View`
    flex-grow:1;
    width: 0;
    color:${props => props.textColor || '#3E495E'};
    margin:20px;
    display: flex;    
    justify-content: flex-start;
    
`;
const H1 = styled.Text`
    color:${props => props.color || "#3E495E" };
    font-weight:bold;
    font-size:20px;
    height:25px;

`;

export {StyledHeaderView,StyledMenuBurger,StyledTitle,H1}
import { View,Text,StyleSheet,TouchableHighlight,Image } from 'react-native';
import styled from 'styled-components/native';

export const StyledMainView = styled.View`
                    flex: 1; 
                    min-height:200px;                  
                   
                `;


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 10,
    marginBottom:15,
    paddingBottom:20,
    
  },
  box: {
    width: 75,
    height: 75,
    alignItems:'center',
    justifyContent:'flex-start'
  },
  wrapper: {
    marginVertical: 10, alignItems: 'center'
  }
});


import React, { Component } from 'react';
import { connect,useSelector,useDispatch} from "react-redux";
import { View, Text } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import styled from 'styled-components/native';

import { withTranslation } from 'react-i18next';
import { withTheme } from '_theming/themeProvider';
import {domusIcons} from '_assets/icons/domusIcons';
import PureIconRender from '_components/pureIconRender';


class ProductToSelect extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
        checked:false
    };
  
  }

  
    toggleCheckBox = ()  => {
       
        this.setState({checked:!this.state.checked});
        console.log("ToggleCheced changed",this.state.checked);
        console.log(this.props.notify);
        this.props.notify(this.props.itemId,this.state.checked)
    }

    getFilteredIcon = () => {
        const retVal = (domusIcons[this.props.typeName] != undefined) ?  this.props.typeName+'.svg' : this.props.image;   
        return retVal;
      }

    iconFiltered = this.getFilteredIcon()
   

  render() {
      /* https://github.com/facebook/react-native/issues/1438 */
      console.log("Render productToSelect",this.props.itemId)
      if(this.props.typeName == "composite") {
          return ( null)
      } else {   
            return (
                <>
                <ItemRenderContainer style={{flex:1,flexDirection:'row'}}>
                    <View style={{minWidth:50}}>
                        <PureIconRender img={this.iconFiltered} size={50} fill={this.props.fill}/>
                    </View>
                    <View style={{marginLeft:10,flexGrow:3, width: 0}}>
                        <View>
                            <Title color={this.props.fill}>{this.props.name}</Title>
                        </View>
                        
                    
                    </View>
                    <View style={{minWidth:50}}>
                        <CheckBox disabled={false} value={this.state.checked}
                            onValueChange={()=> {this.toggleCheckBox()}}
                            tintColors={{true:this.props.fill}}
                        />
                    </View>
                </ItemRenderContainer>                
            </>
            );
      }
  }
}


function mapStateToProps(state,props){

    // ATTENTION RENDER console.log("props.itemId",props.itemId)
    const itemId = props.itemId;
    return {    'image':state.objects.entities.objects[itemId].img,
                'name':state.objects.entities.objects[itemId].name,
                'typeName':state.objects.entities.objects[itemId].typeName,
                'itemId':itemId
            }
    //return {product:state.objects.entities.objects[itemId],itemId:itemId}
    
  };

  export default withTranslation()(withTheme(connect(mapStateToProps)(ProductToSelect)));

/**************************************/
const Title = styled.Text`
    color:${props => props.color || "white" };
    font-size:16px;       
`;
const SubTitle = styled.Text`
    color:${props => props.color || "white" };
             
`;
const ItemRenderContainer = styled.View`
    color:${props => props.color || "white" };
    border-bottom-width:1px;
    border-bottom-color:${props => props.color || '#CCCCCC' };
    margin-bottom:0px;
    padding: 15px 0px;
    align-items: center;
    justify-content: center;
`;
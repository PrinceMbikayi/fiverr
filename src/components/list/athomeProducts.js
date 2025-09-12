import React, {Component} from 'react';

import { View,Text,FlatList,Image,TouchableOpacity} from 'react-native';

import { MaterialIcon } from '_components/ui/icons';
import styled from 'styled-components/native';
import {without as lodashWithout} from 'lodash'

import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

import { withTheme } from '_theming/themeProvider';
import { AthomeProductsImages} from '_images/products/athome';
import {athomeProducts,notInGroupProducts} from '_config/products/core'

import {genericProducts} from '_config/products/generic'

class AthomeProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    if(props.isGroup == undefined) {
      console.log("là")
      this._athomeProducts = [...athomeProducts,...genericProducts]
    } else {
      console.log("ou là")
      this._athomeProducts = [...lodashWithout(athomeProducts,...notInGroupProducts),...genericProducts];
    }
    

  }

  

  componentDidMount() {
     
  }

  componentWillUnmount() {
    
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  } 

  onSelectProductType = (id) => {
      this.props.selectionCallback(id)
  }

  renderItem = (data) => {
    const { t,theme, baseColors } = this.props;
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;
   
    return (
          <ItemRenderContainer >
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {this.onSelectProductType(data.item)}} style={{flex:1,flexDirection:'row'}}>  
                    <View>
                        <Image source={AthomeProductsImages[data.item]} style={{ height: 40, width: 40, backgroundColor:'#DDDDDD' }}/>
                    </View>
                    <View style={{marginLeft:10,flexGrow:3}}>
                        <Title color={textColor}>{t('productAtHome:'+data.item+'_NAME')}</Title>
                        <SubTitle  color={textColor}>{t('productAtHome:'+data.item+'_SHORT_DESCRIPTION')}</SubTitle>
                    </View>
                    <View style={{marginLeft:10}}>                        
                            <MaterialIcon name="chevron-right" size={40} color={textColor}/>                       
                    </View>
                  </TouchableOpacity>
            </ItemRenderContainer>                
           
    )
    
  }



  render() {
   
    return (
      <View  style={[this.props.style]}>       
        <FlatList
              keyExtractor = {(item) => `key-${item}`}
              data={this._athomeProducts}
              renderItem={this.renderItem} 
              removeClippedSubviews={false}
              showsVerticalScrollIndicator={false}
              
            />
      </View>
    );
  }
}

export default withTranslation()(withTheme(AthomeProducts));

/**************  STYLED  ************************/
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
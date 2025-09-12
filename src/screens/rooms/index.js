import React from 'react';
import { connect } from "react-redux";
import {SafeAreaView,View, Text, TouchableHighlight,Button,FlatList,SectionList} from 'react-native';
import { ListItem } from 'react-native-elements'
import {Api} from "../../api";
import {AppConfig} from '_config'
//import {ROOM_UPDATE} from '../../actions/rooms';
import * as TodoActionCreators from '../../actions/rooms'

//import store from '../../store'

class RoomsScreen extends React.Component {

    
  constructor(props) {
      super(props);
     
  }
  
  shouldComponentUpdate(nextProps, nextState) {

    let retVal = ( (nextProps !== this.props) || (nextState !== this.state));
    console.log("ROOMS SCREEN shouldComponentUpdate",retVal);
    return retVal;
  }




  static defaultProps = {rooms:{}}

  /*
  UNSAFE_componentWillMount(){
    //Api.getRooms();
  }
*/

  componentDidMount() {
   
    Api.getRooms();
    //Api.getObjects();
  }



  


  getEntity(id){
    console.log(id,this.props.rooms.entities.rooms[id])
    return this.props.rooms.entities.rooms[id];
  }

/*
  renderItemDeBase = ({ item }) => {
    console.log('renderItem =>');
    console.log(item);
    return (
      <View>
        <Text>{this.props.rooms[item].name}</Text>
      </View>
    );
  }
  */

 goToOtherScreen(roomId,roomName) {
 
  this.props.navigation.navigate(
    "Room",{'roomId':roomId,'roomName':roomName});
   
}

myGoBack = () => {
  this.props.navigation.goBack();
}



  renderItem = ({ item }) => {

      var icon = AppConfig.SERVER_URL+"/theme/profalux/img/domus_objects/statuses/android.svg";
      console.log("renderItem",icon);
      return  (
        
        <ListItem
          title={this.props.rooms[item].name}
          leftAvatar={{ source: { uri: icon } }}
          bottomDivider
          chevron
          onPress={() => this.goToOtherScreen(item,this.props.rooms[item].name)}
         
          keyExtractor = {(item) => `key-${item}`}
         
        />
      )
    }
  /*
  subtitle={item.subtitle}
  leftAvatar={{ source: { uri: item.avatar_url } }}
    */

   keyExtractor = (item, index) => index;

  render(){
      return <SafeAreaView >
          <View >
          <Button
          title="Change Room"
          style={{backgroundColor:'#ff0000'}}
          onPress={() => this.myGoBack()}
          />
            <Text>Screen: CHILD ()</Text>
            <Text>---------------------</Text>
            <FlatList
              keyExtractor = {(item) => `key-${item}`}
              data={Object.keys(this.props.rooms)}
              renderItem={this.renderItem} 
              removeClippedSubviews={false}
              
              
            />

          

          </View>

    </SafeAreaView>
   
    
  }
}

/*

<FlatList
              keyExtractor = {(item) => `key-${item}`}
              data={Object.keys(this.props.rooms)}
              renderItem={this.renderItem} 
             
            />

            */


function mapStateToProps(state){
  console.log('mapStateToProps > rooms',state.rooms.entities);
  return {     
    rooms: state.rooms.entities
  }
};
function mapDispatchToProps(dispatch) {
  return({
      afficher: (essai) => {dispatch({type:USER_UPDATE,payload:{email:essai}})},
      changeName: () => {
        console.log('ChangeName');
       dispatch(TodoActionCreators.roomUpdate({name:'voili'}))
      },

  })
}

export default  connect(mapStateToProps,mapDispatchToProps)(RoomsScreen);

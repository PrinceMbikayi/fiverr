import React from 'react';
import { connect } from "react-redux";
import {SafeAreaView,View,TouchableOpacity,StyleSheet, Text, TouchableHighlight,Button,FlatList} from 'react-native';

import * as RoomsActionCreators from '../../actions/rooms'
import * as ObjectsActionCreators from '../../actions/objects'

import { SimpleListWithReorder} from '../templates/SimpleListWithReorder';
import {getObjectsInRoom} from '../../selectors/re-re-objects'
import {AppConfig} from '_config'

class RoomScreen extends React.Component {

  
  
  static navigationOptions = ({navigation}) => ({
    title: navigation.state.params.roomName
  })


  constructor(props) {
      super(props);
      console.log("AppConfig >>>>>>>",AppConfig)
     
  }
  
  componentDidMount() {
    console.log("componentDidMount",this.props.objectsArray);
    console.log("ROOM SINGLE",this.props.navigation.state)
    
  }


  myGoBack = () => {
    this.props.navigation.goBack();
  }
  
  itemExpandMore = (item) => {
    console.log("room +> itemExpandMore ",item,this.props.navigation,AppConfig)
    //console.log(this.props.navigation.getChildNavigation(AppConfig.appRoutesNames.ROOMS));
    this.props.navigation.navigate('Details',{itemId:item});
    console.log("after navigation expected")
  }
  
  

  render(){

    const roomId = this.props.navigation.state.params.roomId

   

    return <SafeAreaView style={{flex:1}}>
              <SimpleListWithReorder source={this.props.objectsArray} allObjects={this.props.objects} itemExpandMore={this.itemExpandMore}/>
           </SafeAreaView>    
  }



}




function mapStateToProps(state,infos){

  let navigation = infos.navigation;  
  let roomId = navigation.state.params.roomId;
  
 let objectsIds = getObjectsInRoom(state,roomId);
 
  return {     
    room : state.rooms.entities[roomId],
    objectsArray :objectsIds,
    objects:state.objects.entities.objects
   
  }
};

function mapDispatchToProps(dispatch) {
  return({
     
      getRoom: (roomId) => {
        console.log('GetRoom('+roomId+")");
       dispatch(RoomsActionCreators.getRoom({id:roomId}))
      },
      testUpdate: (objectId) => {
        dispatch(ObjectsActionCreators.objectUpdate({id:objectId,name:'newman'}))
      }

  })
}

export default  connect(mapStateToProps,mapDispatchToProps)(RoomScreen);

const styles = StyleSheet.create({
  container: {
   flexDirection: 'row',
   backgroundColor: 'pink',
   flex:1
  },
  button: {
   flex:1,
  
 },
 buttonText: {
  padding: 20,
  color: 'white'
 }
})
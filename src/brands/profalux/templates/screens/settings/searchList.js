import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, TouchableOpacity} from 'react-native';
import { Searchbar } from 'react-native-paper';
import {Api} from "_api";
import { withTheme } from '_theming/themeProvider';
import { ScrollView } from 'react-native-gesture-handler';

class SearchList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      error: null,
      selection:null
    };

    this.arrayholder = [];
  }

  componentDidMount() {
    
    const test = this.props.endpoint;
    this.makeRemoteRequest(test);
    
  }

  componentDidUpdate(prevProps, prevState) {
    
    
   
    if(prevProps.endpoint != this.props.endpoint) {
      const endpoint = this.props.endpoint
     
      this.makeRemoteRequest(endpoint);
    }
    
  }

  makeRemoteRequest = async (endpoint) => {
   
   
    this.setState({ loading: true });   
    let res = await Api.getStaticFile(endpoint);
    console.log('STATIC_SERVER_WEATHER_TOWN_FILE :', res);
   
    if(res.errCode == 200) {
        this.setState({ data:[], error: res.error || null,
                        loading: false,})
        this.arrayholder=res.res.data;
    }
    
    /*

    fetch(url)
      .then(res => res.json())
      .then(res => {
        this.setState({
          data: res.results,
          error: res.error || null,
          loading: false,
        });
        this.arrayholder = res.results;
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
      */
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#CED0CE',
          marginLeft: '0%',
        }}
      />
    );
  };

  searchFilterFunction = text => {
    this.setState({
      value: text,
    });
    if(text.length < 3){
        this.setState({
            data: [],
          });

          return true
    };

    const newData = this.arrayholder.filter(item => {
      const itemData = `${item.text.toUpperCase()}`;
      const textData = text.toUpperCase();

      return itemData.indexOf(textData) > -1;
    });
    this.setState({
      data: newData,
    });
  };

  // Right = ({color,style})=>{
  //   return(
  //     <View style={{height:40, backgroundColor:'red'}}>
  //       <TextInput></TextInput>
  //     </View>
  //   )
  // }

  renderHeader = () => {
      const {placeHolder,baseColors} = this.props;
      const textColor = "#3E495E"
    return (
      <Searchbar
        placeholder={placeHolder}
        onChangeText={text => this.searchFilterFunction(text)}
        value={this.state.value}
        style={{backgroundColor:'white', borderColor:'#CCC', borderWidth:1,height:40, width:"100%" }}
        inputStyle={{backgroundColor:'transparents',opacity:1, marginRight:60, position:'relative', top:-10}}
        placeholderTextColor={textColor}
      />
    );
  };

  onItemClickHandler = (item) => {
      //console.log(item)
      this.setState({
        selection: item,
      });
      this.props.onSelect(item)
  }

  createWeather = () => {
      this.props.createCallBack(this.state.selection.text,this.state.selection.id)
  }


  render() {

    const {theme,baseColors} = this.props;
    const {bgColor,headerBackgroundColor,headerTextColor} = baseColors;
    const textColor = "#3E495E"

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'transparent'}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{backgroundColor:"#f7faff",borderRadius:20,width:'100%', height:"100%"}}>
        {this.state.selection == null &&
        <FlatList
            data={this.state.data}
            renderItem={({ item, index }) => (
              <TouchableOpacity 
                onPress={() => this.onItemClickHandler(item)}
                activeOpacity={0.1}
                style={{backgroundColor:'white', padding:4, borderRadius:20, marginLeft:10,}}
                //key={item?.id}
                >
                <ScrollView>
                  <Text style={{color:textColor}}>{`${item.text}`}</Text>
                </ScrollView>
              </TouchableOpacity>   
            )}
            keyExtractor={item => item.id}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            stickyHeaderIndices={[0]}
        />
       
      }
     {

     }
      </View>
    );
  }
}

export default withTheme(SearchList);
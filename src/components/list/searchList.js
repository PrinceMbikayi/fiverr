import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { ListItem, SearchBar} from 'react-native-elements';
import {Api} from '../../api'
import { withTheme } from '_theming/themeProvider';

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

  renderHeader = () => {
      const {placeHolder,baseColors} = this.props;
    return (
      <SearchBar
        placeholder={placeHolder}
        lightTheme
        round
        onChangeText={text => this.searchFilterFunction(text)}
        autoCorrect={false}
        value={this.state.value}
        containerStyle={{backgroundColor:this.props.baseColors.bgColor}}
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
    const {bgColor,textColor,headerBackgroundColor,headerTextColor} = baseColors;

    if (this.state.loading) {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:theme.body}}>
          <ActivityIndicator />
        </View>
      );
    }
    return (
      <View style={{ flex: 1,backgroundColor:bgColor }}>
        {this.state.selection == null &&
        <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
            <ListItem
                
                title={`${item.text}`}
                onPress={() => this.onItemClickHandler(item)}
                color={textColor}
                titleStyle = {{color:textColor}}
                containerStyle={{backgroundColor:bgColor}}
            />
            )}
            keyExtractor={item => item.email}
            ItemSeparatorComponent={this.renderSeparator}
            ListHeaderComponent={this.renderHeader}
            stickyHeaderIndices={[0]}
        />
       
      }
     {
     
        /*
        this.state.selection != null 
        ?
            <View style={{padding:15}}>
                <Text>Vous avez choisi la ville de : {this.state.selection.text}</Text>
                <Text>Cliquez sur le bouton ci-dessous pour créer la météo de {this.state.selection.text}</Text>
                <Button title="CREER"  style={{marginTop:20}} onPress={() => {this.createWeather()}}/>
            </View>
        :

        null
        */
     }
      </View>
    );
  }
}

export default withTheme(SearchList);
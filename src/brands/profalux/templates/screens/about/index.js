import '_brand/templates/screens/_locales'
import React from 'react';
import { connect } from "react-redux";
import {SafeAreaView, View,Text,Platform } from 'react-native';
import styled from 'styled-components/native';
import { withTranslation } from 'react-i18next';
import { ScrollView} from 'react-native-gesture-handler';

import { withTheme } from '_theming/themeProvider';
import {HeaderWithMenu} from '_components/headers/header-with-menu';
import {changeLogs} from '_brand/config/AppBrandChangeLog';
import {getServer as getStoredServer} from '_services/storage';
import { useTheme } from '_theming/themeProvider'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';


import {logout} from '_api/Api';


class AboutScreen extends React.Component {


  constructor(props){
    super(props);
  
    this.state = {serverUrl:' -- '};
    this.serverUrl = " -- "
    this.getServerUrl();

    if(props.isTester) {
      //console.log("changeLogs",changeLogs)
      this.displayChanges = [...changeLogs]
    } else {
      this.displayChanges = [changeLogs.shift()];
    }

    console.log("this.displayChanges",this.displayChanges,props.isTester);

  }
 
getServerUrl = async() => {
    const tt = await getStoredServer();   
    this.setState({serverUrl:tt})
    return tt;
  }
  
  handleBackPress = () => {

  }
  
  doLogout = () => {
    logout(true); // do not delete credentials
    //Ws.closeMe();
  }

  

  render(){

    // const { theme } = useTheme();

    // const borderColor = theme?.prflxBorderColor || 'orange';
    // const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    // const bgcolor = theme?.prflxbgColor || 'white';
    // const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    // const textColor = theme?.prflxTextColor || 'black'
    // const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    // const iconColor = theme?.prflxIconColor || "#3E495E";
    // const iconBgColor = theme?.prflxIconbgColor || "#FFFFFF";

    
    const {t, theme, baseColors, isTester } = this.props;
    const {bgColor,headerBackgroundColor,headerTextColor} = baseColors;
    const textColor = "#3E495E";
    const changes = this.displayChanges;
   
    const rnv = Platform?.constants?.reactNativeVersion;
    const reactNativeVersion = rnv?.major+'.'+rnv?.minor+'.'+rnv?.patch
    //console.log("Platform?.constants?.reactNativeVersion",Platform?.constants?.reactNativeVersion)


    const goBack = ()=>{
      this.props.navigation.goBack() 
    }
    return (
      <SafeAreaView style={{ height:'100%', backgroundColor: 'white' || bgcolor }} >
        <View style={{flex:1, backgroundColor: 'white', }}>

            <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
              <HeaderWithBack
                //title={uObject.name}
                title={t("MENU_ABOUT")}
                //titleMarginLeft = {40}
                backSVG centered
                goBack={{ action: goBack}}
                noShadow />
              {/* <Text style={{backgroundColor:'transparent', marginLeft:-130, fontSize:20, fontWeight:'600'}}>Nouvelle pièce</Text> */}
            </View>

              <MainView style={{backgroundColor:bgColor}}>
              {/* <Button title="delog plz" onPress={this.doLogout}/> */}
                <BodyText color={textColor}>{t("account:ACCOUNT")} : {this.props.email}</BodyText>

                {(this.props.isTester && this.state.serverUrl.indexOf('athome.avidsen.one') == -1  && 1 == 1 )&&
                  <>
                  <BodyText color={textColor}>{t("account:SERVER")} : {this.state.serverUrl}</BodyText>
                
                  </>

                }
              
                {this.props.isTester  &&
                  <>
                  <BodyText color={textColor}> Serveur : {this.state.serverUrl}</BodyText>
                  <BodyText color={textColor}> React Native : {reactNativeVersion}</BodyText>
                  </>

                }
                <Text style={{color:textColor,marginTop:10,marginBottom:10}}>--------------------------</Text>
                {changes.map(function(v,i){
                  return (
                    <View key={"aaa_hey"+i.toString()}>
                    
                    <BodyText color={textColor} style={{marginBottom:8}}>{t("account:VERSION")} : {v?.version.toString()}</BodyText>
                    <BodyText color={textColor} style={{marginBottom:8}}>{t("account:DATE")} : {v?.date.toString()}</BodyText>
                    {v?.changes && 
                      <BodyText color={textColor} style={{marginBottom:8}}>{t("account:CHANGES")} :</BodyText>
                    }
                    {
                      v?.changes?.map((val,ind)=> (
                          <BodyText color={textColor} key={ind.toString()}>- {val}</BodyText>
                      ))
                    }
                    <Text style={{color:textColor,marginTop:10,marginBottom:10}}>--------------------------</Text>
                    {isTester &&
                      <>
                      {v?.devChanges && 
                        <BodyText color={textColor} style={{marginBottom:8}}>{t("account:CHANGES")} :</BodyText>
                      }
                      {
                        v?.devChanges?.map((val,ind)=> (
                            <BodyText color={textColor} key={ind.toString()}>- {val}</BodyText>
                        ))
                      } 
                      </>
                      
                    }
                    {changes.length > 1 &&
                      <Text style={{color:textColor,marginTop:10,marginBottom:10}}>--------------------------</Text>
                    }
                    </View>
                  )
                })}
                </MainView>

        </View>
    </SafeAreaView>
    )
  }
}



export default withTranslation()(withTheme(connect(mapStateToProps)(AboutScreen)));

function mapStateToProps(state){
   return {     
    email: state.user.login,
    isTester: state.user.isTester
  }
};

const MyScreenView = styled.SafeAreaView`
    background-color:${props => props.bgColor || 'black'};
    flex:1;
`;
const MainView = styled.ScrollView`
    background-color:${props => props.bgColor || 'white'}; 
    padding:10px; 
    flex:1;        
`;
const BodyText = styled.Text`
    color:${props => props.color || 'white'};           
`;


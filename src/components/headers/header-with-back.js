import React,{ useContext,useState,useEffect} from 'react';
import { View,Text,TouchableOpacity,Image} from 'react-native';
import { useSelector } from 'react-redux';


import { useNavigation,useFocusEffect,StackActions } from '@react-navigation/native';
import { useDeviceOrientation } from '@react-native-community/hooks';


import { useTheme } from '_theming/themeProvider';
import { HeaderButton } from './header-button';
import {ShadowBorder} from '_components/ui/shadow-border';
import {StyledHeaderView,StyledMenuBurger,StyledTitle,H1} from './headerStyled';

import Icon from 'react-native-vector-icons/MaterialIcons';

import ArrowLeft from '_brand/images/icons/app/ArrowLeft'
 

 /**
  * 
  * @param {Object} props 
  * @param {string} props.title 
  * @param {string} [props.backIcon] - default "chevron-left"
  * @param {boolean} [props.backSVG] - display arrowLeft from brand app icon
  * @param {boolean} [props.noBack] - hide back
  * @param {number} [props.backIconSize] - default 40
  * @param {string} [props.bgColor] - default theme["header--color--bg"]
  * @param {string} [props.color] - default theme['drawer--color--text']
  * @param {boolean} [props.noShadow] - default false
  * @param {any} [props.screenHeaderButtons] - a JSX node
  * @param {object} [props.extraButtons] - an array to build extraButtons i.e. settings
  * @param {boolean} [props.backDoClose] - Go to previous Stack
  * @param {boolean} [props.themeDependency] - default false
  * @param {boolean} [props.centered] - title is centered
  * @returns a header with back
  */   
export const HeaderWithBack = (props) => {
   
    const {theme,baseColors} = useTheme();
    const {headerBackgroundColor,headerTextColor} = baseColors;

    const { title,noShadow,themeDependency,pop,
            backIcon =  "chevron-left",
            backSVG,noBack, objectMenu,
            color = headerTextColor || theme['drawer--color--text'],
            bgColor = (themeDependency)?  headerBackgroundColor || theme["header--color--bg"] : "transparent",
            backIconSize = 40,
            extraButtons=[],
            centered
            } = props;

    //  bgColor = (themeDependency)? 'red' || headerBackgroundColor || theme["header--color--bg"] : "yellow",
    
  
    const navigation = useNavigation(); 
    //console.log("HeaderWithMenu navigation",navigation,"parent",navigation.dangerouslyGetParent());
    //const textColor = props.textColor || theme['header--color--text'];
    const previousRoute = useSelector(state => state.app.previousRoute)
   
    //const bgColor = props.bgColor || theme['color--bg'] || "yellow";
    
    const orientation = useDeviceOrientation()
    
    
    const _close = () => {
        if(props.close !== null) {
            if(props.close.action != undefined) {
                props.close.action()
            } else {
                //default
                
                handleBackToPreviousScreen();
            }
            
        } else {
            // nothing close is not shown
        }
    }

    const _goBack = () => {
        
       
        if(props.goBack) {
            if(props.goBack.action != undefined) {
                props.goBack.action()
            } else {
               console.log("if it's not the expected behaviour, check if goBack param is like {action:yourCallback} ")
                navigation.goBack();
            }
            
        } else {
            if(props.backDoClose) {
                handleBackToPreviousScreen();
            } else {
               
                navigation.goBack();
            }
        }
    }




    const handleBackToPreviousScreen = () => {

        navigation.dispatch(StackActions.popToTop());
        //then go to previous Stack View
        if(previousRoute)navigation.navigate(previousRoute);   
        
      }

     // const color = props.color || theme['drawer--color--text'];
   
    const buildExtraButtons = () => {
       if(extraButtons.length == 0)return <View style={{width:40}}/>;
       
       const options = extraButtons;
      
       // console.log("options ScreenHeaderButtons",options)      
        return (
            <View style={{backgroundColor:'transparent',minWidth:40,height:32,marginRight:15,alignItems:'center', alignContent:'center'}}> 
                <View style={{flex:1,justifyContent:'center', flexDirection:'row'}}>
                { options.map((v,i) => {
                    return (
                      
                       <HeaderButton callback={v.action} img={v.icon} svgr={v.svgr} key={"hwb_"+title+"_"+i} fillColor={color} iconSize={24}/>
                      
                    )
                })         
                }
                </View>
            </View>
        )       
    }

    const [builtExtraButtons,setBuiltExtraButtons] = useState(buildExtraButtons())

   

// Harold :  This function display the "3 vertical button menu" if objectMenu (the content of the menu ) exist
// Or in default mode will return leftArrow for going
   const displayBack = () => {
        //console.log("propsdisplayBack  ----------------->",backSVG,noBack)
      
        if(objectMenu) return objectMenu;
        if(noBack)return null;
        if(backSVG) {
            return <ArrowLeft color={color}/>
        } else {
            return <Icon name={backIcon} size={backIconSize} color={color} />
        }
       
   }

   const [backIconDisplayed, setBackIconDisplayed] = useState(displayBack());
   useEffect(()=> {
    setBackIconDisplayed(displayBack())
   },[])
    return (
            <>
            <StyledHeaderView bgColor={bgColor} style={{height:40}}>
                <TouchableOpacity  onPress={() => _goBack()} style={{width:40,minWidth:40,flexDirection:'row',alignItems:'center',justifyContent:'center',backgroundColor:'#FF000001',paddingRight:5}}>
                    {backIconDisplayed}
                </TouchableOpacity>
                <StyledTitle style={[{marginLeft:0,marginRight:0,backgroundColor:'transparent'},{...centered ? {alignItems:'center'}:{}}]}><H1 color='green' style={[{flexWrap: 'wrap'}]} ellipsizeMode='tail' numberOfLines={1}>{title}</H1></StyledTitle>
            
                {props.close &&
                    <TouchableOpacity onPress={() => _close()} style={{flex:1,justifyContent:"flex-end",marginRight:10,   flexDirection:'row',alignItems:'center',width:40,maxWidth:40}}>
                        <Icon name="close" size={32} color={color}/>
                    </TouchableOpacity>
                }
                {props.screenHeaderButtons &&
                <View style={{marginRight:15,backgroundColor:'transparent',justifyContent:'flex-end',flexDirection:'row'}}>
                   {
                    props.screenHeaderButtons   
                   }
                   </View>
                }
                {
                    builtExtraButtons
                }
            </StyledHeaderView>
            {!noShadow && 
                 <ShadowBorder ratio={orientation.portrait} themeDependency={themeDependency}/>
            }
           
           </>
    )
}

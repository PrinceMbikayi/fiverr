import React from "react";
import { View, Text, Pressable, StyleSheet} from 'react-native';

/**
 * This component render an svg icon that has been converted to JS component
 * 
 * @param {Object} props
 * @param {component} props.IconJSName  inon name must start with a Capital letter, it's the JS name under which your icon component is imported
 * @param {string} props.iconId
 * @param {boolean} props.iconActive pressable icon state  
 * @param {number}  props.iconSize size of the view encapsutated the icon component
 * @param {string} props.iconColor icon component color attribute
 * @param {string} [props.iconTitle] icon head title
 * @param {string} props.iconCaption icon caption at the bottom
 * @param {object} props.iconViewStyle style for the only icon wrapper
 * @param {object} props.iconTitleStyle icon title style
 * @param {object} props.iconCaptionStyle icon Caption style
 * @param {boolean} props.iconIsPressable  is icon a button ?
 * @param {Function} props.onIconPress  callback to handle icon press 
 * @param {Function} props.onIconPressIn callback to handle icon press in 
 * @param {Function} props.onIconPressOut callback to handle icon press out 
 * @param {Function} props.onIconLongPress callback to handle icon long press
 */
export const IconJSRender = (props) =>{
    const {
        IconJSName, iconId, iconColor, iconSize, iconTitle, iconCaption, iconTitleStyle, iconCaptionStyle, 
        iconIsPressable, onIconPress, iconViewStyle, onIconPressIn, onIconPressOut, onIconLongPress,
        delayLongPressDuration} = props;

        //const [active, setActive] = useState(false);

        const onIconPressHandler = () =>{
            onIconPress(iconId);
            //setActive(!active);
            //onsole.log("IconJSRender id here :", iconId)
        }
        const onIconPressInHandler = () =>{
            onIconPressIn(iconId);
            //setActive(!active);
            //onsole.log("IconJSRender id here :", iconId)
        }
        const onIconPressOutHandler = () =>{
            onIconPressOut(iconId);
            // setActive(!active);
            //onsole.log("IconJSRender id here :", iconId)
        }
    return(
        <View style={{flex:1, justifyContent:'center', alignItems:'center', flexDirection:'column', flexWrap:'nowrap', minWidth:80,marginVertical:0}}>
            {
                iconTitle &&
                <Text style={styles.iconTitleStyle}>{iconTitle}</Text>
            }
            <Pressable 
                disabled = {!iconIsPressable}
                style={[styles.iconViewStyle,{width:iconSize || 24, height:iconSize || 24}]}
                onPress={onIconPressHandler}
                onPressIn={onIconPressIn}
                onPressOut={onIconPressOut} 
                onLongPress={onIconLongPress}
                delayLongPress = {delayLongPressDuration || 2000}
                >
                    <IconJSName color={iconColor || 'black'} id={iconId}/>
                    {/* <IconJSName color={iconActive == true? iconActiveColor: (iconColor|| 'black')} id={iconId}/> */}
            </Pressable>
            {
                iconCaption &&
                <Text style={styles.iconCaptionStyle}>{iconCaption}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    textStyle:{
        color:'white',
        fontSize:20,
    },
    iconViewStyle:{
        margin:10,
    },
    iconTitleStyle:{
        color:"black",
        position:'absolute',
        top:50,
    }
});

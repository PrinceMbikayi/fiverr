import React, {useState, useEffect} from 'react';
import { Text, View, Pressable, StyleSheet} from 'react-native';
import { useTheme } from '_theming/themeProvider';
import styled from 'styled-components/native'



export const DaysButtons = (props) => {

    const { containerStyle, onPress, buttons, isActive} = props;

    const { theme } = useTheme();
    const testColor = theme?.onBody || 'yellow';
    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgWhitecolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor ||"white";
    const textColor = theme?.prflxTextColor || 'black'

    const [daysList, setDaysList] = useState([]);

    useEffect(()=> {
        console.log('DAYS_LISTS :', daysList);
    },[daysList]);

    const handleClick = (item)=>{
        console.log('ITEM_DAY :', item);
        //setClickedId(item.id);
        const dayId = item?.id
        onPress(item)
        const position = daysList?.indexOf(dayId)
        if (position == -1) {
            setDaysList([...daysList, dayId])
        }else{
            let newSelection = [...daysList]
            newSelection.splice(position, 1);
            setDaysList(newSelection)
        }
    }

    return (
        <View style={styles.container}>
            {
                buttons.map((item, index)=>{
                    return(
                        <Pressable
                            key={index}
                            index={item.id}
                            onPress={()=> handleClick(item)}
                            style={[
                                isActive == item.id? [styles.buttonActive,] : [styles.button, {backgroundColor:'#DBDADA',}],
                                containerStyle,]}
                            >
                            {/* <Text style={isActive == item.id ? [styles.textActive, {color:textColor}] : [styles.text, {color:"white"}]}>{item.label}</Text> */}
                            <DayText 
                                        color={isActive == item.id ? textColor : textColor}
                                        fontWeight = {isActive == item.id ? 700 : 400}
                                    >
                                        {item.label}
                                    </DayText>
                        </Pressable>
                    )
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        //flex:1,
        flexDirection:'row',
        justifyContent:'space-evenly', 
        paddingVertical:10
        //alignItems:'center'
    },
    buttonActive:{
        width:30, 
        height:30, 
        borderRadius:15, 
        borderColor:"orange",
        backgroundColor:'white',
        borderWidth:1,
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    button:{
        width:30, 
        height:30, 
        borderRadius:15, 
        //backgroundColor:'white',
        justifyContent:'center', 
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        elevation: 10,
    },
    text:{
        textAlign: 'center', 
        //color: 'white', 
        fontSize: 12, 
        fontWeight: '700' 
    },
    textActive:{
        textAlign: 'center', 
        color: 'white', 
        fontSize: 13, 
        fontWeight: '700' 
    }
})
const DayText = styled.Text`
        align-content:center;        
        align-self:center; 
        font-size:13;
        font-weight:${props =>props.fontWeight}
        color: ${props => props.color}; 
                
                `;
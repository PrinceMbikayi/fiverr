import React from 'react';
import { Text, View,StyleSheet } from 'react-native';

import { useTheme } from '_theming/themeProvider';
import { SelectList } from 'react-native-dropdown-select-list'
//--- Appium -----
import { buildTestId } from '_helpers/appium';


/**
* return a useful multiline component
* @param {Object} props
* @param {Object} props.options liste of key-value pair options objects for selection 
* @param {string} props.title
* @param {string} props.placeholder
* @param {Object} props.defaultOption
* @param {state} props.setSelected set a selected state value
* @param {function} props.callback
* 
*/
export const RoomSelection = (props) => {

    const { title, placeholder, defaultOption, options, setSelected } = props;
    const { theme, changeTheme, themeID, baseColors } = useTheme();
    const { bgColor, headerBackgroundColor, headerTextColor } = baseColors;
    const textColor = theme?.prflxTextColor||'black'
    //======== APPIUM =============
    const renameInputID = buildTestId("rename");
    const renameTextID = buildTestId("textDisplayed")




    return (

        <View>
            <View style={[styles.renameContainer, { marginTop: 5 }]}>
                <Text style={styles.text}>{title}</Text>
                <SelectList
                    search={false}
                    setSelected={setSelected}
                    data={options}
                    boxStyles ={{backgroundColor:'#EDEDED', borderRadius:12, height:44, width:254}}
                    dropdownStyles = {{backgroundColor:'#EDEDED', borderRadius:12, width:254}}
                    dropdownTextStyles={{color:textColor}}
                    inputStyles={{color:textColor}}
                    placeholder={placeholder}
                    defaultOption={defaultOption}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    renameContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-evenly',
        padding: 0,
        borderRadius: 12
    },
    text: {
        fontSize: 14,
        color: '#3E495E',
        marginBottom: 15,
        fontWeight:'600'
    },
    validateButton: {
        borderRadius: 20,
        height: 40,
        width: '90%',
        marginBottom: 10
    },
})
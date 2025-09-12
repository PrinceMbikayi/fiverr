import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, View, Modal, StyleSheet, TouchableOpacity, Platform} from 'react-native';
import { useTranslation } from 'react-i18next';
import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider'
import {DateMonthPickerIos} from '_brand/templates/screens/routines/screens/applicationScreen/components/DateMonthPickerIos';
import {DateMonthPickerAndroid} from '_brand/templates/screens/routines/screens/applicationScreen/components/DateMonthPickerAndroid';


/**
 * 
 * @param {Object} props
 * @param {String} props.modalTitle
 * @param {Function} props.cancelDateMonthSelection
 * @param {Function} props.validateDateMonthSelection
 * @param {Function} props.switchModalState
 * @param {Boolean} props.modalVisible
 * @param {String} props.initialDate
 * @param {String} props.initialMonth
 * @returns
 * 
 */

export const DateMonthSelector = (props)=>{

    const {
            initialDate, initialMonth, modalTitle, modalVisible, switchModalState, 
            cancelDateMonthSelection,validateDateMonthSelection, pickerWidth, pickerHeight
        } = props   

    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;    
    moment.locale(currentLang);
    const tns = "routine";
    const { theme } = useTheme();
    const textColor = theme?.prflxTextColor || 'black'

    console.log('INITIAL_DATE :', initialDate, initialMonth);

    const [dateMonth, setDateMonth] = useState({date:initialDate, month:initialMonth});
    
    useEffect(()=> {
        console.log('DATE_MONTH :', dateMonth);
    },[dateMonth]);

    const handleDateChange = (date)=>{
        console.log('NOUVEAU_DATE :', date)
        setDateMonth({...dateMonth, date:date});
    }
    const handleMonthChange = (month)=>{
        console.log('NOUVEAU_MONTH :', month);
        setDateMonth({...dateMonth, month:month});
    }

    const handleValidate = ()=>{
        console.log('NEW_DATE_MONTH :', dateMonth);
        validateDateMonthSelection(dateMonth);
    }

    return(
        <View style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start',padding:0,}}>
            <Modal
                animationType="none" // animation type (fade, slide, none)
                transparent={true}    // make the background transparent
                visible={modalVisible}
                onRequestClose={switchModalState} // iOS-specific, used for closing modal via hardware back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, {color:textColor}]}>{modalTitle}</Text>
                        <View style={{borderWidth:0,
                            justifyContent:'center',
                            borderColor:"orange",borderRadius:20, 
                            transform: [{ scale: 1, }] }}
                            >
                            {Platform.OS == "ios" ?
                                <DateMonthPickerIos
                                    onDateChange={handleDateChange}
                                    onMonthChange={handleMonthChange}
                                    initialMonth={initialMonth}
                                    initialDate={initialDate}
                                    pickerWidth={pickerWidth}
                                    pickerHeight={pickerHeight}
                                />
                                :
                                <DateMonthPickerAndroid
                                    onDateChange={handleDateChange}
                                    onMonthChange={handleMonthChange}
                                    initialMonth={initialMonth}
                                    initialDate={initialDate} 
                                    pickerWidth={pickerWidth}
                                    pickerHeight={pickerHeight}
                                />
                            }
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={cancelDateMonthSelection} style={[styles.closeButton,{backgroundColor:textColor, marginRight:10}]}>
                                <Text style={styles.closeButtonText}>{t(tns + ":" + "CANCEL")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleValidate} style={[styles.closeButton,{backgroundColor:textColor, marginLeft:10}]}>
                                <Text style={styles.closeButtonText}>{t(tns + ":" + "VALIDATE")}</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalContainer: {
      width: 300,
      padding: 10,
      backgroundColor: '#EDEDED',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 16,
      fontWeight:'600',
      marginBottom: 0,
    },
    closeButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 5,
    },
    closeButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
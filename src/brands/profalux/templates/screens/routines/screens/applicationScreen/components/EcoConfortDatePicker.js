import '_brand/templates/screens/routines/locales'
import React, {useState, useEffect, useRef} from 'react';
import { Text, TextInput, View,Button, Modal, ScrollView, SafeAreaView, StyleSheet,Pressable, TouchableOpacity} from 'react-native';
import { useTranslation } from 'react-i18next';
import DatePicker from 'react-native-date-picker'
import moment from 'moment/min/moment-with-locales';
import { useTheme } from '_theming/themeProvider'


/**
 * 
 * @param {Object} props
 * @param {String} props.text
 * @param {String} props.placeholderDate
 * @param {String} props.modalTitle
 * @param {Function} props.handleNewDate
 * @param {String} props.currentDate: date object, need to convert to view it : String(currentDate) or moment(currentDate).format('DD MMMM')
 * @returns
 * 
 */

export const EcoConfortDatePicker = (props)=>{

    const {text,modalTitle, handleNewDate, currentDate} = props   

    console.log('APP_CURRENT_DATE :', String(currentDate));
    const nowDate = moment(new Date()).format('DD MMMM')

    const [date, setDate] = useState(currentDate? currentDate:moment.utc(new Date()))//moment.utc(new Date())
    const [displayDate, setDisplayDate] = useState(currentDate ? moment(currentDate).format('DD MMMM') : nowDate)
    const [open, setOpen] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);


    const { t, i18n } = useTranslation();
    const currentLang = i18n.language;    
    moment.locale(currentLang);

    const tns = "routine";
    const { theme } = useTheme();
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const textColor = theme?.prflxTextColor || 'black'


    const openDatePicker = ()=>{
        setModalVisible(!modalVisible);
    }

    const handleDateChange = (newDate)=>{
        console.log('NEW_DATE :', String(newDate));
        setDate(newDate);
    }

    const validateDateSelection = ()=>{
        console.log('NEW_DATE :', String(date), date);
        const newDate = date ? moment(date).format('DD MMMM') : ''
        //const newDate = date ? moment(date).format('DD MMM YYYY') : ''
        setDisplayDate(moment(date).format('DD MMMM'))
        handleNewDate(String(date));
        setModalVisible(!modalVisible);
    }

    const cancelDateSelection = ()=>{
        console.log('OLD_DATE :', String(date));
        setModalVisible(!modalVisible);
    }

    useEffect(()=> {
        console.log('DISPLAY :', String(displayDate));
    },[displayDate]);


    useEffect(()=> {
        console.log('IS_DATE_PICKER_OPENED :', open);
    },[open]);


    useEffect(()=> {
        console.log('DATE_CHANGED :', String(date));
    },[date]);

    return(
        <View style={{flex:1, justifyContent:'flex-start', alignItems:'flex-start',padding:0,}}>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-between',alignItems:'center', }}>
                <View style={{paddingRight:10, backgroundColor:'transparent', justifyContent:'flex-end', alignItems:'flex-start'}}>
                    <View style={{backgroundColor:'transparent',minWidth:200, marginLeft:0,}}>
                        <Text style={{fontSize:16, fontWeight:"400", color:textColor, backgroundColor:'transparent', textAlign:'right' }}>
                            {text}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity onPress={()=>openDatePicker()}  style ={{marginLeft:0,}}>
                    <View style={{marginBottom:5}}>
                        <TextInput 
                            pointerEvents='none'
                            value = {displayDate}
                            editable={false}
                            //defaultValue = {date ? moment(date).format('DD MMMM') : ''}
                            textAlign="center"
                            style={{padding:5, backgroundColor:'#EDEDED', 
                                    fontSize:16, borderRadius:7,minWidth:150, color:textColor
                                }}
                            >
                        </TextInput>
                    </View>
                </TouchableOpacity>
                
            </View>
            <Modal
                animationType="none" // animation type (fade, slide, none)
                transparent={true}    // make the background transparent
                visible={modalVisible}
                onRequestClose={openDatePicker} // iOS-specific, used for closing modal via hardware back button
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={[styles.modalText, {color:textColor}]}>{modalTitle}</Text>
                        <View style={{borderWidth:0,
                            justifyContent:'center',
                            borderColor:"orange",borderRadius:20, 
                            transform: [{ scale: 0.8, }] }}
                            >
                                {/* <DatePicker modal ={false}
                                    date={date ? new Date(date) : new Date()}
                                    onDateChange={handleDateChange}
                                    mode="date"
                                    minimumDate={new Date()}
                                    locale="Fr"
                                /> */}
                        </View>

                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity onPress={cancelDateSelection} style={[styles.closeButton,{backgroundColor:textColor, marginRight:10}]}>
                                <Text style={styles.closeButtonText}>{t(tns + ":" + "CANCEL")}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={validateDateSelection} style={[styles.closeButton,{backgroundColor:textColor, marginLeft:10}]}>
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
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
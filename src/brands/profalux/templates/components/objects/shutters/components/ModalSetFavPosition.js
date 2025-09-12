import '_brand/templates/components/objects/common/locales'
import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '_theming/themeProvider';




export const ModalSetFavPosition = (props)=>{
    const {objectName, modalVisible,  onRequestClose, onRequestOpen } = props

    const { t, i18n } = useTranslation();
    const tns = "common";
    const { theme } = useTheme();

    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'

    return(
        <View>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose = { onRequestClose}
                // onRequestClose={() => {
                //     Alert.alert('Modal has been closed.');
                //     setModalVisible(!modalVisible);
                // }}
            >
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View>
                        <Text style={[styles.modalText,{fontWeight:'600', fontSize:16, marginBottom:20}]}>{t(tns + ":" + "SETTING_OF_FAV_POSITION")} :</Text>
                    </View>

                    <Text style={[styles.modalText,{textAlign:'auto'}]}> 1. {t(tns + ":" + "SET")} {` '${objectName}'`} {t(tns + ":" + "CHOSEN_POSITION_VIA_REMOTE")}</Text>
                    <Text style={[styles.modalText, {textAlign:'auto', marginBottom:20}]}> 2. {t(tns + ":" + "PRESS_UP_DOWN_BUTTONS_FOR_5S")}</Text>
                    <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress=  { onRequestClose}//{() => setModalVisible(!modalVisible)}
                    >
                        <Text style={[styles.textStyle, {color:'white'}]}> {t(tns + ":" + "END")}</Text>
                    </Pressable>
                </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    textStyle: {
        marginTop: 2,
        fontSize: 18,
    },
    // Modal for favorite position
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
      },

      modalView: {
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 30,
        padding: 10,
        borderWidth:3,
        borderColor:"#3E495E",
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
      },

      buttonClose: {
        backgroundColor: '#3E495E',
      },
      modalText: {
        marginBottom: 16,
        textAlign: 'center',
      },
      button: {
        borderRadius: 8,
        padding: 5,
        elevation: 2,
        width:250,
        justifyContent:'center',
        alignItems:'center'
      },

});
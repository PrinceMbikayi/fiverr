import '_brand/templates/components/objects/common/locales'
import React, { useRef, useCallback } from 'react';
import { StyleSheet, View, Text, useWindowDimensions, Pressable, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet'
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export const BottomDeleteSheet = (props) => {

  const { myRef, handleCancel, handleDelete, warningMessage, isRoutine = false } = props;
  const actionSheetRef = myRef || useRef(null);
  const snapPoints = ["25%"]
  const { width } = useWindowDimensions();

  const { t, i18n } = useTranslation(); 
  const tns = "common";
  const navigation = useNavigation();
  const route = useRoute();
  const navigationParams = route?.params || {};

  const renderBackdrop = useCallback((props) => {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    );
  }, []);
  const renderBackground = () => {
    return (
      <View style={{ backgroundColor: 'gray' }}
      />
    );
  }


  return (
    <View style={{ backgroundColor: 'yellow', width: 30 }}>
      <BottomSheetModal
        ref={actionSheetRef}
        index={0}
        snapPoints={snapPoints}
        style={styles.sheetContainer}
        handleStyle={{ backgroundColor: 'green' }}
        detach={true}
        bottomInset={30}
        backgroundStyle={{ backgroundColor: 'red' }}
        backgroundComponent={renderBackground}
        backdropComponent={renderBackdrop}
      >
          <View style={styles.contentContainer}>
            {isRoutine ?
              <Text style={{fontSize:17, fontWeight:'400'}}>{warningMessage}</Text>
              :
            <Text style={{fontSize:17, fontWeight:'400'}}>{t(tns+":"+"DELETE_DESCRIP")}</Text>
            }
          </View>

        <TouchableOpacity
          // myRef.current?.dismiss()
          activeOpacity={0.5}
          onPress={handleDelete}
          style={styles.cancelView}>
           <Text style={{ fontSize: 20, color: 'red' }}>{t(tns+":"+"DELETE_CONFIRM")}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          // myRef.current?.dismiss()
          activeOpacity={0.5}
          onPress={handleCancel}
          style={styles.cancelView}>
          <Text style={{ fontSize: 20, color: 'blue' }}>{t(tns+":"+"DELETE_CANCEL")}</Text>
        </TouchableOpacity>
      </BottomSheetModal>
    </View>
  )
}

const styles = StyleSheet.create({

  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    //width:400,
    marginBottom:0,
    borderRadius: 20,
    backgroundColor: '#cdcdcd',
  },
  deleteView: {
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  cancelView: {
    backgroundColor: 'white',
    marginTop: 5,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40
  },
  sheetContainer: {
    flex: 1,
    paddingHorizontal: 5,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    //backgroundColor:'#65ee09', 
  }
})
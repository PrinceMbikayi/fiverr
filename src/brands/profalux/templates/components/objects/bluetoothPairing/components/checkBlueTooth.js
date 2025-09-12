/*

this compoenent has no render but signal ble Avalibility to parent using the passed callback

it's not realy a render Less component
as it contains all global popup
in fact it seems that device confirm are used now
But the device confirl is gere so keep this "render less" component anywhere it's needed

*/

import React from 'react';
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {Text} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

//import BluetoothStateManager from 'react-native-bluetooth-state-manager';

//-----------------------------------------------------

import FullScreenModalContainer from '../../../ui/modal/modalFullscreenContainer';
import {useGlobalModal} from '_components/ui/globalModal';
import CheckBluetooth from '_images/illustrations/CheckBluetooth.js';

//import {useBleWizard} from '_brand/templates/components/objects/bluetoothPairing/ble/hook';
import {useBleContext} from '_hooks/ble/bleContext';

/**
 * @category category
 * @param {object} props
 * @param {object} ref a useRef to access imperativeHandle
 * @param {boolean} props.manualCheck
 * @param {callback} props.onBlueToothAvailable
 * @param {callback} props.onCancelBluetooth
 * @returns {FC} qqchose
 */
const CheckBlueToothScreen = (props, ref) => {
  

  const {manualCheck, onBlueToothAvailable, onCancelBluetooth, id} = props;

  const globalModal = useGlobalModal();

  const {t} = useTranslation();
  const tns = 'motor';

  const navigation = useNavigation();
  const illustration = <CheckBluetooth />;
  const bluetoothCheckActiveRef = useRef(false);

  const callerIdRef = useRef();

  const uBleContext = useBleContext();

  //-------------------------
  useImperativeHandle(ref, () => ({
    check: async id => {
      console.log("checkBlueTooth.js imperative handle check")
      bluetoothCheckActiveRef.current = true;
      callerIdRef.current = id;
      const resp = await checkBlueTooth();
      console.log('checkBlueTooth.js imperative handle check resp', resp);
      return resp;
    },
    open: () => {
      //selectSourcePopUpRef.current.toggle();
    },
  }));

  //-------------------------

  const activateBluetooth = async () => {
    console.log('activateBluetooth');
    console.log("AAAAAAAAA activateBluetooth",uBleContext)
    const isActivated = await uBleContext.enabledDeviceBluetooth();
    console.log('activateBluetooth response', isActivated);
    if (isActivated) {
      globalModal.close();
      if (onBlueToothAvailable) {
        onBlueToothAvailable();
      }
    }
  };

  const onCancel = () => {
    if (onCancelBluetooth) {
      onCancelBluetooth();
    }
    globalModal.close();
  };

  const title = t(tns + ':' + 'ACTIVATE_BLUETOOTH_TITLE');
  const description = t(tns + ':' + 'ACTIVATE_BLUETOOTH_DESCRIPTION');
  const popupButtons = [
    {
      label: t(tns + ':' + 'ACTIVATE_BLUETOOTH_BUTTON'),
      callback: activateBluetooth,
    },
    {label: t('CANCEL'), callback: onCancel, altStyle: true, noBorder: true},
  ];

  //ACTIVATE_BLUETOOTH_BUTTON

  const myBackHandler = () => {
    console.log('myBackHandler in checkBlueToothScreen');
    onCancel();
    //navigation.goBack();
  };

  const showConfirm = () => {
    console.log(' showConfirm !!! in checlBluettoth');
    const content = (
      <FullScreenModalContainer
        illustration={illustration}
        title={title+"checkBlueTooth.js"}
        description={description}
        buttons={popupButtons}
        doBackHandler={myBackHandler}
      >
       
      </FullScreenModalContainer>
    );

    globalModal.setContent(content);
    globalModal.open();
  };

  const checkBlueTooth = async () => {
    

    console.log("Attention checkBlueTooth")//,uBleContext)
    const bluetoothState = await uBleContext.checkDeviceBlueTooth();

    //const bluetoothState = await BluetoothStateManager.getState();

   

    switch (bluetoothState) {
      case 'off':
        showConfirm();
        break;
      case 'on':
      default:
        break;
    }

    return Promise.resolve(bluetoothState);
  };

  useEffect(() => {
    if (!manualCheck) {
      checkBlueTooth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};
/**
 * A ForwardRef FC
 * useImperativeHandle
 *  - check (id)
 *  - open ()
 *
 *  use Editor AutoSuggest to see params
 */
export default forwardRef(CheckBlueToothScreen);

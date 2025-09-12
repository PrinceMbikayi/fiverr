//import '../../../locales'
import React from 'react';
import {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Linking,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Button from '_brand/templates/components/ui/Button';

//-----------------------------------------------------
import {useTheme} from '_theming/themeProvider';

const ManualForm = props => {
  const {onValidate} = props;
  console.log('porops', props);
  const [waitingResponse, setWaitingResponse] = useState(true);

  const [networkManualSsid, setNetworkManualSsid] = useState(null);
  const [networkManualPassword, setnetworkManualPassword] = useState(null);

  const onChangeSsidText = value => {
    console.log('onChangeSsidText value', value);
    setNetworkManualSsid(value);
  };

  const onChangePasswordText = value => {
    setnetworkManualPassword(value);
  };

  const onValidateForm = () => {
    console.log(networkManualSsid, networkManualPassword);
    onValidate(networkManualSsid, networkManualPassword);
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        value={networkManualSsid}
        onChangeText={onChangeSsidText}
        placeholder="ssid"
      />
      <TextInput
        style={styles.input}
        value={networkManualPassword}
        onChangeText={onChangePasswordText}
        placeholder="password"
      />
      <Button onPress={onValidateForm} title="test manual" />
    </View>
  );
};
export default ManualForm;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

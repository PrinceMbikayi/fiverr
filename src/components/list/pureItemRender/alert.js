import { View, Text, StyleSheet, Alert } from 'react-native';

export const ShowAlert = (title, body, buttons) => {
    Alert.alert(
      title,
      body,
      buttons,
      { cancelable: true }
    );
}
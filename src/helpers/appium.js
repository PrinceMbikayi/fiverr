import { getBundleId } from 'react-native-device-info';
import { Platform } from 'react-native';

const doTestId = (autoId) => {
    if(Platform.OS == 'ios') return autoId;
    const appIdentifier = getBundleId();
    const prefix = `${appIdentifier}:id/`;
    const androidAutoId = `${prefix}${autoId}`;
    return androidAutoId;
}

export const buildTestId = (testId) => {
    //console.log("testId enter",testId)
    const autoId = (testId !== undefined) ? {'testID':doTestId(testId),'accessibilityLabel':testId}: {}
    //console.log("buildTestId",autoId)
    return autoId;

}


   
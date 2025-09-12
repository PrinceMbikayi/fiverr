import React from 'react';
import { Text, View,Linking} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next'
import { withTheme } from '_theming/themeProvider';



const SubscribeAknowledge = (props) => {
    
    const { t, i18n } = useTranslation();
    const termsUrl = t('URL_TERMS');
    const privacyUrl = t('URL_PRIVACY')
    return (
        <View>
            <Text>
                <Trans i18nKey="SUBSCRIPTION_CONDITIONS">
                    By subscribing I understand and agree to the <Text style={{color: 'blue'}} onPress={() => Linking.openURL(termsUrl)}>Terms</Text> and our <Text style={{color: 'blue'}} onPress={() => Linking.openURL(privacyUrl)}>Privacy Policy</Text>
                </Trans>
           </Text>
        </View>
    )
}

export default  withTheme(SubscribeAknowledge);

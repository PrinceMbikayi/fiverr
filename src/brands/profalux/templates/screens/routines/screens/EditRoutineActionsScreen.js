import '_brand/templates/screens/routines/locales'
import React from 'react';
import { SafeAreaView, Text, View, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '_theming/themeProvider'
import { EquipmentsRenderInRoutine } from '_brand/templates/screens/routines/components/EquipmentsRenderInRoutine'
import { HeaderWithBack } from '_brand/templates/components/headers/header-with-back';
import Button from '_brand/templates/components/ui/Button';
import { useScenario } from '_brand/templates/screens/routines/hook/useScenario'
import { myToast } from '_brand/templates/components/ui/myToast';


export const EditRoutineActionsScreen = (props) => {

    console.log('IT_ME_RENDERED :::::::NEW_EditRoutineActionsScreen');
    const uScenario = useScenario();
    const { selection, saveRoutine, actionsByItemId, routineName } = uScenario;

    console.log('ENTERED_ACTIONS :', actionsByItemId);

    const navigation = useNavigation();
    const { t, i18n } = useTranslation();
    const tns = "routine";

    const { theme } = useTheme();
    const containerbgcolor = theme?.prflxContaintBgColor || 'white';
    const bgcolor = theme?.prflxbgColor || 'white';
    const headerBgColor = theme?.prflxHeaderBackground || '#FFFFFF'
    const iconColor = theme?.prflxIconColor || "#3E495E";


    const goBackHandleRoutine = () => {
        navigation.goBack()
    }


    const handleNext = async () => {
        console.log('SELECTED_ACTIONS :', actionsByItemId);
        let allEquipHasAction = true;
        for (const [key, value] of Object.entries(actionsByItemId)) {
            if (value.length == 0) {
                allEquipHasAction = false
            }
        }

        if (allEquipHasAction == false) {
            myToast(`${t(tns + ":" + "EQUIP_LACK_ACTION")}`)
        } else {
            navigation.navigate("RoutinePlanningScreen")
        }

    }

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: 'white' || bgcolor }} >
            <View style={{ flex: 1, backgroundColor: 'white', }}>
                <View style={{ backgroundColor: 'transparent' || headerBgColor, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <HeaderWithBack
                        title={routineName}
                        backSVG centered
                        goBack={{ action: goBackHandleRoutine }}
                        noShadow />
                </View>

                <ScrollView
                    style={{ backgroundColor: 'transparent', paddingHorizontal: 10, }}
                    showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}
                >

                    <Text style={{ fontSize: 14, fontWeight: '600', marginVertical: 15 }}> {t(tns + ":" + "SELECT_ACTION_TODO")} </Text>
                    <EquipmentsRenderInRoutine source={selection} actionsByItemId={actionsByItemId} />

                    <View style={[styles.bodyContent, { marginTop: 15, backgroundColor: containerbgcolor }]}>
                        <View style={{ marginTop: 10 }}>
                            <Button onPress={() => navigation.navigate("ChooseRoutineNameAndObjectsScreen")} altStyle title={t(tns + ":" + "ADD_ANOTHER_EQUIP")} titleColor='white' bgColor={iconColor} noBorder />
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <Button onPress={handleNext} altStyle title={t(tns + ":" + "NEXT")} titleColor='white' bgColor={iconColor} noBorder />
                        </View>
                    </View>
                </ScrollView>

            </View>

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    bodyContent: {
        flex: 1,
        justifyContent: 'center',
        padding: 5,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 10,

    },
    text: { marginVertical: 15 }
})
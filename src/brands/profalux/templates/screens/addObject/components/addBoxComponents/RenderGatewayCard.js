import React from 'react';
import { View, Text, Image, Pressable, TouchableOpacity } from 'react-native';
import { CardResponsive } from '_brand/templates/screens/addObject/components/CardResponsive';
import { useTheme } from '_theming/themeProvider';
import { iconsJs } from '_brand/utils/iconsJs';
import RoxNeosol from '_brand/images/icons/app/profaluxIconJs/RoxNeosol'
//import RoxNeosol from '_brand/images/icons/app/svg/RoxNeosol.svg'

export const RenderGatewayCard = (props) => {
    const {
        ImageJs, imgWidth, imgHeight, sideText, sideTextBoxWidth,opacity,
        withArrow, onPressNextArrow, imgOnly, sideTextTitle,
        imgMarginLeft, cardPading, iconColor, cardBgColor, disabled,
        dongleId, addDongleText, handleWarning, hasZigbeeDongle
    } = props;


    const { theme, baseColors } = useTheme();

    const borderColor = theme?.prflxBorderColor || 'orange';
    const bgcolor = theme?.prflxContaintBgColor || 'white';
    const lineWidgetBgColor = theme?.prflxVerticalMultiIconsBgColor || "white";
    const textColor = theme?.prflxTextColor || 'black'



    let card = (
        <View style={{ flexDirection: 'row' }}>
            <View
                style={{
                    flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', backgroundColor: 'transparent',
                    flex: 1, marginLeft: imgMarginLeft || 0, paddingVertical: cardPading,
                }}>
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center' }}>
                    {ImageJs &&
                        <View style={{ backgroundColor: 'transparent', width: imgWidth || 150, height: imgHeight || 70, marginLeft: 10 }}>
                            <ImageJs color={iconColor} />
                        </View>
                    }
                    <View style={{ backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ width: sideTextBoxWidth || 250, fontSize: 16, fontWeight: '600', color: textColor, textAlign: 'center' }}>
                            {sideText}
                        </Text>
                        {addDongleText !=""&& //dongleId == -1
                            <Text style={{ fontSize: 14, fontWeight: "400", color: textColor, marginTop: 5}}>{addDongleText}</Text>
                        }
                    </View>
                </View>
            </View>
            {withArrow &&
                <Pressable
                    onPress={onPressNextArrow}
                    disabled={disabled}
                    style={{ width: 25, opacity: 0.5, backgroundColor: 'transparent', justifyContent: 'center' }}
                >
                    <View style={{ height: 25 }}>
                        <iconsJs.rightChevronIcon.name color={textColor} />
                    </View>
                </Pressable>
            }

        </View>
    )




    return (
        <TouchableOpacity activeOpacity={1} onPress={handleWarning}>
            <Pressable
                onPress={onPressNextArrow}
                disabled={disabled}
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    backgroundColor: cardBgColor || "white",
                    borderColor: borderColor,
                    borderWidth: 1,
                    borderRadius: 16,
                    padding: 5,
                    justifyContent: imgOnly ? 'flex-start' : 'center',
                    alignItems: 'center',
                    opacity: opacity || 1,
                }}
            >

                {card}
            </Pressable>
        </TouchableOpacity>
    )
}

import React, { useState } from "react";
import { Modal, TouchableOpacity, View, StyleSheet, Text, Dimensions} from "react-native";
import {iconsJs} from '_brand/utils/iconsJs';
import { MultiPurposeWidgetLine } from '_brand/templates/components/objects/common/MultiPurposeWidgetLine';



const { width, height } = Dimensions.get('window');
/**
 * clickable round
 * @param {Object} props
 * @param {string} props.options
 * @param {function} props.handleAction
 * @returns 
 */
export const PopupMenu = (props) => {
    const { options, popupWidth, lastOptionColor } = props;
    const [visible, setVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{ justifyContent: 'center', alignItems: 'center' }}
            >
                    <MultiPurposeWidgetLine 
                        isPressable = {false}
                        icons={[iconsJs.kebabIcon]} 
                        iconSize={25}
                    />
            </TouchableOpacity>
            <Modal transparent visible={visible} onRequestClose={() => setVisible(false) }>
                <TouchableOpacity
                    style={{ flex: 1}}
                    onPress={() => setVisible(!visible)}
                >
                    <View style={[styles.popup, { width: popupWidth || 254 }]}>
                        {
                            options.map((op, i) => (
                                <TouchableOpacity
                                    key={"op"+i}
                                    style={[styles.option, { borderBottomWidth: (i === options.length - 1) ? 0 : 1 }]}
                                    onPress={()=>{op.action(op.id); setVisible(false)}}
                                    //activeOpacity={1}
                                >
                                    <Text style={[styles.text, { color: (i === options.length - 1) ? (lastOptionColor ||'red') : '#3E495E' }]}>{op.title}</Text>
                                    <View>
                                        <MultiPurposeWidgetLine 
                                            isPressable = {false}
                                            icons={[{id: op.id, name:op.iconJSName}]} 
                                            iconSize={22}
                                            iconColor={i == options.length - 1 ? (lastOptionColor ||'red') : '#3E495E'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        </>
    )
}


const styles = StyleSheet.create({
    popup: {
        flex: 1,
        minHeight: 44,
        borderRadius: 10,
        //backgroundColor: "yellow",
        backgroundColor: "#fffcf7",
        borderColor: "#fffcf7",
        borderWidth: 1,
        position: 'absolute',
        paddingHorizontal: 10,
        top: height*0.08,// 0.04,
        right: width*0.1,//60,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.9,
        elevation: 8,
        shadowColor: '#52391b',

    },
    option: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 9,
        borderBottomColor: "#b6b6b6",
    },
    iconViewStyle: {
        marginLeft: 10,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    text: {
        fontSize: 17,
    }
})






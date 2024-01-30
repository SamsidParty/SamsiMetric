import { StyleSheet, StatusBar, Text, View, ActivityIndicator, Button, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Global } from "./Global.js";
import { Button as AndroidButton } from 'react-native-paper';

export function NativeComponentBridge()
{

    var [componentQueue, setComponentQueue] = React.useState([]);

    Global.setComponentQueue = (param) => { setComponentQueue(JSON.parse(param)); };

    var styleTemplate = {
        container: {
            backgroundColor: "transparent",
            position: "absolute",
            width: "100%",
            height: "100%"
        }
    }

    var style = StyleSheet.create(styleTemplate);

    return (
        <View pointerEvents="box-none" style={style.container}>
            {
                componentQueue.map((l_comp) =>
                {
                    if (l_comp.type == "Button")
                    {
                        return (<NativeButton key={l_comp.id} data={l_comp} />)
                    }
                })
            }
        </View>
    )
}

function NativeButton(props)
{

    var style = StyleSheet.create({
        nonce: {
            display: "none"
        },
        container: {
            position: "absolute",
            width: props.data.width,
            height: props.data.height,
            top: props.data.top,
            left: props.data.left,
        },
        button: {
            backgroundColor: !props.data.disabled ? "#007AFF" : Global.Colors.Secondary(),
            width: "100%",
            height: "100%",
            padding: 10,
            borderRadius: 15,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            color: "white"
        },
        text: {
            color: !props.data.disabled ? "white" : Global.Colors.Background(),
            fontSize: 17,
            fontWeight: "700"
        },
        androidButton: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: "0px"
        },
        androidContent: {
            width: props.data.width,
            height: "100%"
        },
        androidText: {
            fontSize: 17,
            fontWeight: "700",
            fontFamily: "Inter-Variable"
        }
    });

    var onPress = () => {
        if (!props.data.disabled) {
            Global.webView?.injectJavaScript(`window.returnQueue["${props.data.id}"]("Button");`);
        }
    }

    return (
        <View style={style.container}>
            {
                Global.Platform == "ios" ?
                    (
                        <TouchableOpacity onPress={onPress} style={style.button}>
                            <Text style={style.text}>{props.data.text}</Text>
                        </TouchableOpacity>
                    ) :
                    (
                        <AndroidButton disabled={!!props.data.disabled} onPress={onPress} labelStyle={style.androidText} contentStyle={style.androidContent} style={style.androidButton} mode="contained-tonal">
                            {props.data.text}
                        </AndroidButton>
                    )
            }
            <Text style={style.nonce}>{Math.random().toString()}</Text>
        </View>

    )
}
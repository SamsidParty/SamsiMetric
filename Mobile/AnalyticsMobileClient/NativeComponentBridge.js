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
        container: {
            position: "absolute",
            width: props.data.width,
            height: props.data.height,
            top: props.data.top,
            left: props.data.left,
        },
        button: {
            backgroundColor: "#007AFF",
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
            color: "white",
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
            fontFamily: "InterVariable"
        }
    });

    return (
        <View style={style.container}>
            {
                Global.Platform == "ios" ?
                    (
                        <TouchableOpacity style={style.button}>
                            <Text style={style.text}>{props.data.text}</Text>
                        </TouchableOpacity>
                    ) :
                    (
                        <AndroidButton onPress={() => console.log('')} labelStyle={style.androidText} contentStyle={style.androidContent} style={style.androidButton} mode="contained-tonal">
                            {props.data.text}
                        </AndroidButton>
                    )
            }

        </View>

    )
}
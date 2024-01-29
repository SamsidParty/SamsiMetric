import { StyleSheet, StatusBar, Text, View, ActivityIndicator, Button, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Global } from "./Global.js";

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
            fontSize: "20px"
        }
    });

    return (
        <View style={style.container}>
            <TouchableOpacity
                style={style.button}
            >
                <Text style={style.text}> Touch Here </Text>
            </TouchableOpacity>
        </View>

    )
}
import { StyleSheet, StatusBar, Text, View, ActivityIndicator, Button, Image, TouchableOpacity } from 'react-native';
import { useRef, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useTheme } from 'react-native-paper';
import { Global } from "./Global.js";
import { NativeComponentBridge } from "./NativeComponentBridge.js";
import { GetCurrentProfile, LoadClient } from './Profiles.js';
import { decode as atob, encode as btoa } from 'base-64';

export function TopBar()
{
    //The Amount Of Processes Running That Trigger Loading Animation, 0 = No Loading Animation
    var [ loaderCount, setLoaderCount ] = useState(0);  
    Global.setLoaderCount = setLoaderCount;
    Global.loaderCount = loaderCount;
    Global.increaseLoaderCount = () => setLoaderCount(Global.loaderCount + 1);
    Global.decreaseLoaderCount = () => setLoaderCount(Global.loaderCount - 1);

    var style = StyleSheet.create({
        container: {
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            position: "absolute",
            width: "100%",
            height: "7%",
            top: Global.Platform == "ios" ? "0%" : StatusBar.currentHeight,
            left: "0%",
            zIndex: 100,
            padding: 0
        }
    });

    return (
        <View style={style.container}>
            <ProjectSelect/>
            <KeyIcon/>
        </View>
    );
}

function ProjectSelect() {
    const [selectedProject, setSelectedProject] = useState();
    var pickerRef = useRef();

    return (
        <>

        </>
    )
}

function KeyIcon() {

    var style = StyleSheet.create({
        container: {
            backgroundColor: "#ADB5B9",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            marginRight: 30,
            borderRadius: 260,
            height: "75%",
            aspectRatio: 1
        },
        keyIcon: {
            width: "100%",
            height: "100%"
        }
    });

    return (
        <TouchableOpacity onPress={() => Global.webView.reload()} style={style.container}>
            {
                //Show Either A Loading Icon Or A Key Icon (Provided By Server)
                Global.loaderCount > 0 ?
                <ActivityIndicator /> :
                <Image
                    style={style.keyIcon}
                    source={{uri: "http://192.168.100.8/Analytics/Images/DefaultProfileIcon.png"}}
                />
            }
        </TouchableOpacity>
    )
}

export function MainView()
{
    var style = StyleSheet.create({
        container: {
            backgroundColor: Global.Colors.Background(),
            width: "100%",
            height: "100%",
            position: "absolute"
        },
        web: {
            backgroundColor: "transparent"
        }
    });
    
    var matTheme = useTheme();

    Object.entries(matTheme.colors).forEach((l_col) =>
    {
        Global.Colors["mat" + l_col[0]] = l_col[1];
    });

    Global.webView = useRef();
    Global.loadClient = LoadClient;

    return (
        <View style={style.container}>
            <WebView
                ref={(ref) => (Global.webView = ref)}
                style={style.web}
                onMessage={OnWebMessage}
                source={GetCurrentProfile().page}
                webviewDebuggingEnabled={true}
                allowFileAccess={true}
                allowFileAccessFromFileURLs={true}
                allowUniversalAccessFromFileURLs={true}
                originWhitelist={['*']}
                onNavigationStateChange={OnWebStateChange}
            />
            <NativeComponentBridge/>
        </View>
    );
}

async function OnWebMessage(e) {
    var data = JSON.parse(e.nativeEvent.data);

    if (data.RunOnGlobal) {
        Global[data.RunOnGlobal](data.Param1, data.Param2, data.Param3);
    }

    if (data.GetFromGlobal) {
        var childTree = data.GetFromGlobal.split(".");
        var childTreeLength = childTree.length; // This Needs To Be Static Because childTree Keeps Changing
        var toGet = Global;

        for (var i = 0; i < childTreeLength; i++) {
            if (i > 0) {
                childTree.shift(); // Remove First Element
            }

            toGet = toGet[childTree[0]];

            if (typeof toGet == "function") {
                toGet = await toGet();
            }
        }

        Global.webView?.injectJavaScript(`window.returnQueue["${btoa(data.Request)}"](${JSON.stringify(toGet)});`);
    }
}

function OnWebStateChange(state)
{
    
}
import { StyleSheet, StatusBar, Text, View, ActivityIndicator, Button, Image } from 'react-native';
import { useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { Global } from "./Global.js";
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
            backgroundColor: Global.Colors.Secondary(),
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            height: "8%",
            marginTop: Platform.OS == "android" ? (StatusBar.currentHeight || 30) : 0,
            padding: 12
        }
    });

    return (
        <View style={style.container}>
            <ProjectSelect/>
            <KeyIcon/>
            <Button title='joe mma' onPress={() => Global.webView.reload()}>yo</Button>
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
            backgroundColor: Global.Colors.IconBackground(),
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "auto",
            borderRadius: 10,
            height: "100%",
            aspectRatio: 1
        },
        keyIcon: {
            width: "100%",
            height: "100%"
        }
    });

    return (
        <View style={style.container}>
            {
                //Show Either A Loading Icon Or A Key Icon (Provided By Server)
                Global.loaderCount > 0 ?
                <ActivityIndicator /> :
                <Image
                    style={style.keyIcon}
                    source={{uri: "http://192.168.100.8/Analytics/Images/DefaultProfileIcon.png"}}
                />
            }
        </View>
    )
}

export function MainView()
{
    var style = StyleSheet.create({
        container: {
            backgroundColor: Global.Colors.Background(),
            width: "100%",
            flex: 8
        },
        web: {
            backgroundColor: "transparent"
        }
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
                onNavigationStateChange={OnWebStateChange}
            />
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
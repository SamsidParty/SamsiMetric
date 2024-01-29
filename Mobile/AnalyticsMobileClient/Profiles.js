import { Global } from "./Global.js";
import LZString from "lz-string";
import * as FileSystem from 'expo-file-system';
import { decode as atob, encode as btoa } from 'base-64';

var DefaultPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Analytics</title>
    <style>
        body {
            background-color: transparent;
        }
    </style>
</head>
<body>
    <script>
        function load() {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                RunOnGlobal: "increaseLoaderCount"
            }));

            setTimeout(() => {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    RunOnGlobal: "decreaseLoaderCount"
                }));
            }, 3000);
        }

    </script>
    <button onclick="load()">Enable Loading</button>
</body>
</html>
`;

async function ResolveRequest(request, param) {
    Global.webView?.injectJavaScript(`window.returnQueue["${btoa(request)}"](${param});`);
}

async function LoadDependency(name) {
    var script = await ReadDependency(name);

    if (name.endsWith(".css")) {
        script = `LoadCSSDependency("${btoa(script)}");`;
    }

    script += "\ntrue;";

    if (script != "") {
        //console.log("Loading " + name);
        await Global.webView?.injectJavaScript(script);
    }
}

async function SaveDependency(name, value) {
    var clientDir = FileSystem.cacheDirectory + GetCurrentProfile().id + "/";

    var dirInfo = await FileSystem.getInfoAsync(clientDir);
    if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(clientDir, { intermediates: true });
    }

    await FileSystem.writeAsStringAsync(clientDir + btoa(name) + ".dat", value);
}

async function ReadDependency(name) {
    var clientDir = FileSystem.cacheDirectory + GetCurrentProfile().id + "/";
    var info = await FileSystem.getInfoAsync(clientDir + btoa(name) + ".dat");

    if (!info.exists) { return "" }
    return FileSystem.readAsStringAsync(info.uri);
}

//Install The Client From A Prebuilt Binary
async function InstallStatic(version) {
    var clientUrl = `${GetCurrentProfile().host}/Clients/${version}.client`;
    var binary = await (await fetch(clientUrl)).text();
    
    bundle = LZString.decompressFromUTF16(binary);
    var contents = bundle.split(String.fromCharCode(0x1C));

    for (var i = 0; i < contents.length; i++) {
        if (contents[i] == "") { continue; }
        if (i % 2 != 0) {
            await SaveDependency(contents[i - 1], contents[i]);
        }
    }
}

export function GetCurrentProfile() {
    return GetProfiles()[1];
}

export function GetProfiles() {
    return [
        {
            name: "Local",
            host: null,
            id: "local",
            page: { html: DefaultPage },
        },
        {
            name: "Local",
            host: "http://192.168.100.8/Analytics",
            id: "203847892734",
            page: { uri: "http://192.168.100.8/Analytics/MobileClient" },
        }
    ];
}
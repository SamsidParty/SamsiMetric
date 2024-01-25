import { Global } from "./Global.js";
import LZString from "lz-string";
import * as FileSystem from 'expo-file-system';
import {decode as atob, encode as btoa} from 'base-64';

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

export async function LoadClient(version) {
    Global.increaseLoaderCount();

    Global.loadDependency = async (dep, request) => {
        await LoadDependency(dep);
        await ResolveRequest(request, true);
    };

    //try {
        await InstallDynamic(version);
    //}
    //catch {
    //    console.log("error");
    //}

    await LoadDependency("./JS/Common/helper.js");
    await LoadDependency("./JS/Mobile/main.jsx");

    Global.decreaseLoaderCount();
}

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

async function InstallDynamic(version) {
    //Load Babel
    if (!Global.hasBabelLoaded){
        var dep = await (await fetch(GetCurrentProfile().host + "/JS/ThirdParty/babel.js")).text();
        (1, eval)(dep);
        Global.hasBabelLoaded = true;
    }


    var installerContext = {
        autoload: []
    };

    var collectedDependencies = await CollectDependencies(installerContext);
    var cssBundle = "";

    for (var l_dep of collectedDependencies) {
        var file = await fetch(l_dep.replace(".", GetCurrentProfile().host), { headers: { 'Cache-Control': 'no-cache' } });
        //console.log(`Downloaded ${l_dep}`);

        if (l_dep.endsWith(".jsx")){
            var script = await file.text();
            //Convert JSX To JS
            script = Babel.transform(script, { presets: ["react"] }).code;
        }
        else if (l_dep.endsWith(".css")){
            var script = await file.text();
            //Add To CSSBundle
            cssBundle += "\n" + script;
            continue;
        }
        else if (l_dep.endsWith(".js")){
            var script = await file.text();
        }
        else {
            //Load As Binary File
            var script = `LoadBinaryDependency("${btoa(l_dep)}", "${(await BlobToBase64(await file.blob()))}")`;
        }

        await SaveDependency(l_dep, script);
    }

    await SaveDependency("./bundle.css", cssBundle);

    await SaveDependency("client-version", version);
    await SaveDependency("installer-context", JSON.stringify(installerContext));
}

//Fetch Indexes To Get All Needed Files
async function CollectDependencies() {

    var collectedDependencies = [];

    //Collect CSS Files
    var cssFiles = ParseIndexTree(await (await fetch(GetCurrentProfile().host + "/CSS/")).text(), (l_file) => { return l_file.endsWith(".css"); });
    cssFiles.forEach((l_file) => collectedDependencies.push("./CSS" + l_file));

    //Collect JS Files
    var jsFiles = ParseIndexTree(await (await fetch(GetCurrentProfile().host + "/JS/")).text(), (l_file) => { return l_file.includes(".js"); });
    jsFiles.forEach((l_file) => collectedDependencies.push("./JS" + l_file));

    //Collect Font Files
    var fontFiles = ParseIndexTree(await (await fetch(GetCurrentProfile().host + "/Fonts/")).text(), (l_file) => { return l_file.includes(".ttf") || l_file.includes(".woff"); });
    fontFiles.forEach((l_file) => collectedDependencies.push("./Fonts" + l_file));

    //Collect Image Files
    var imageFiles = ParseIndexTree(await (await fetch(GetCurrentProfile().host + "/Images/")).text(), (l_file) => { return l_file.includes(".png") || l_file.includes(".svg"); });
    imageFiles.forEach((l_file) => collectedDependencies.push("./Images" + l_file));

    return collectedDependencies;
}

function ParseIndexTree(treeString, accept) {
    var parsed = JSON.parse(treeString);
    var fileList = [];

    var traverseTree = (tree, parent) => {
        tree.forEach((l_file) => {
            if (l_file.dir) {
                traverseTree(l_file.dir, parent + l_file.name + "/");
            }
            else if (accept(l_file.file.toLowerCase())) {
                fileList.push(parent + l_file.file);
            }
        });
    }

    traverseTree(parsed, "/");

    return fileList;
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

function BlobToBase64(blob) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
}
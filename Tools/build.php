<?php

function rrmdir($dir) { 
    if (is_dir($dir)) { 
      $objects = scandir($dir);
      foreach ($objects as $object) { 
        if ($object != "." && $object != "..") { 
          if (is_dir($dir. DIRECTORY_SEPARATOR .$object) && !is_link($dir."/".$object))
            rrmdir($dir. DIRECTORY_SEPARATOR .$object);
          else
            unlink($dir. DIRECTORY_SEPARATOR .$object); 
        } 
      }
      rmdir($dir); 
    } 
}

//https://stackoverflow.com/a/12763962/18071273
function xcopy($source, $dest, $permissions = 0755)
{
    $sourceHash = hashDirectory($source);

    if (is_link($source)) {
        return symlink(readlink($source), $dest);
    }

    if (is_file($source)) {
        return copy($source, $dest);
    }

    if (!is_dir($dest)) {
        mkdir($dest, $permissions);
    }

    $dir = dir($source);
    while (false !== $entry = $dir->read()) {
        if ($entry == '.' || $entry == '..') {
            continue;
        }

        if($sourceHash != hashDirectory($source."/".$entry)){
             xcopy("$source/$entry", "$dest/$entry", $permissions);
        }
    }

    $dir->close();
    return true;
}

function hashDirectory($directory){
    if (! is_dir($directory)){ return false; }

    $files = array();
    $dir = dir($directory);

    while (false !== ($file = $dir->read())){
        if ($file != '.' and $file != '..') {
            if (is_dir($directory . '/' . $file)) { $files[] = hashDirectory($directory . '/' . $file); }
            else { $files[] = md5_file($directory . '/' . $file); }
        }
    }

    $dir->close();

    return md5(implode('', $files));
}

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'POST') {

    //Start Build, Which Enables The Build API Key
    file_put_contents("../.build", $virtualAPI["input"]);

    //Delete Previous Build
    if (is_dir("../Build/")) {
        rrmdir("../Build/");
    }
    mkdir("../Build/");
    mkdir("../Build/Clients/");

    exit(0);
}
else if ($virtualAPI["server"]['REQUEST_METHOD'] == 'PATCH') {

    //Upload Client Build
    $clientVersion = file_get_contents("../.build");
    $path = "../Build/Clients/" . $clientVersion . ".client"; // No Need To Sanitize, The Person Building Already Has Access To The File System ;)
    file_put_contents($path, $virtualAPI["input"]);

    //Create Server Build
    $buildInstructions = json_decode(file_get_contents("./build.json"), true);

    foreach ($buildInstructions as $inst) {
        if ($inst["action"] == "copyfolder") {
            xcopy($inst["from"], $inst["to"]);
        }
        else if ($inst["action"] == "copyfile") {
            copy($inst["from"], $inst["to"]);
        }
        else if ($inst["action"] == "mkdir") {
            mkdir($inst["to"]);
        }
    }

    file_put_contents("../Build/.prod", $clientVersion);

    unlink("../.build");

    exit(0);
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Build Tool</title>

    <style>

        * {
            font-family: Verdana, Geneva, Tahoma, sans-serif;
            box-sizing: border-box;
        }

        body {
            margin: 0;
            width: 100vw;
            height: 100vh;

            display: flex;
            justify-content: center;
            align-items: center;
        }

        .buildTool {
            width: 800px;
            height: 500px;
            background-color: aliceblue;
            border-radius: 15px;
        }

        .log {
            width: 100%;
            height: 400px;
            overflow-y: scroll;
            padding: 15px;
        }
    </style>

</head>
<body>
    <div class="buildTool">
        <div class="log" id="log">

        </div>
        <label>Target Version:</label>
        <input id="version" type="text" />
        <button onclick="StartBuild()">Start Build</button>
    </div>

    <iframe id="slave" width="100" height="100" style="display: none;"></iframe>

    <script>

        var lsBackup = {};

        function Log(text) {
            document.getElementById("log").innerText += text + "\n";
        }

        async function WaitUntil(cond) {
            if (cond()) { return; }
            const delayMs = 10;
            while(!cond()) await new Promise(resolve => setTimeout(resolve, delayMs));
        }

        function BackupStorage() {
            for (var key in localStorage){
                if (typeof(localStorage[key]) != "function"){
                    lsBackup[key] = localStorage[key];
                }
            }

            Log("Backed Up LocalStorage");
        }

        function RestoreStorage() {
            localStorage.clear();

            for (var key in lsBackup){
                if (typeof(localStorage[key]) != "function"){
                    localStorage[key] = lsBackup[key];
                }
            }

            Log("Restored LocalStorage");
        }

        async function ApplyDebugAPIKey() {
            await fetch(window.location.href, { method: "POST", body: document.getElementById("version").value }); // Tells The Server To Activate The Build API Key

            localStorage.clear();
            localStorage.apikey_id = "build";
            localStorage.apikey_name = "Build";
            localStorage.apikey_perms = "admin";
            localStorage.apikey_value = "build";

            Log("Sent Build Request To Server");
        }

        //Slave Is An IFrame That Runs The Dashboard, Which Dynamically Loads All The Files
        async function LaunchSlave() {
            window.slave = document.getElementById("slave");
            slave.src = "../Dashboard";
            Log("Launching Build Slave");

            await WaitUntil(() => {
                return (slave.contentWindow.busy != undefined)
            });

            slave.contentWindow.console.log = (data) => Log("[SLAVE] " + data);

            Log("Build Slave Loaded");

            await WaitUntil(() => {
                return (slave.contentWindow.finishedLoadingDependencies)
            });

            Log("Downloaded All Client Dependencies");

            slave.contentWindow.CreateStaticBundle();

            await WaitUntil(() => {
                return (slave.contentWindow.createdStaticBundle)
            });

            Log("Client Build Complete");
        }

        async function PublishBuild() {
            Log("Building Server");
            await fetch(window.location.href, { method: "PATCH", body: slave.contentWindow.createdStaticBundle }); // Push The Build To The Server
            Log("Server Build Complete");
        }

        async function StartBuild() {
            var version = document.getElementById("version").value;
            if (version.length < 1) { Log("Enter A Version Number"); return; }
            Log(`Build Started (Version ${version})`);

            BackupStorage();
            await ApplyDebugAPIKey();
            await LaunchSlave();
            await PublishBuild();
            RestoreStorage();

            Log("Build Complete!");

            setTimeout(() => location.reload(), 5000);
        }

        Log("Build Tool Client Ready");
    </script>
</body>
</html>
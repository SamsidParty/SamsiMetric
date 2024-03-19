AutoLoadThisFile();

async function LoadAllPlugins() {
    var pluginList = ParseIndexTree(await (await fetch("./Plugins/index.php")).text(), (e) => e.endsWith(".js") || e.endsWith(".jsx"));
    
    for (let i = 0; i < pluginList.length; i++) {
        var l_plugin = pluginList[i];
        var script = await (await fetch("./Plugins/" + l_plugin)).text();

        //Transform Babel
        if (window.Babel && l_plugin.endsWith(".jsx")) {
            script = Babel.transform(script, { presets: ["react"] }).code;
        }

        eval(script);
        console.log("Plugin Loaded " + l_plugin);
    }

    setTimeout(() => {
        console.log("Dispatching All Plugins...");
        PluginAPI.registeredPlugins.forEach((l_plugin) => {
            l_plugin.main();
            console.log("Plugin Dispatched " + l_plugin.name);
        });
    }, 0);

}

window.PluginAPI = {
    registerPlugin: (name, main) => {
        console.log("Plugin Registered " + name);
        PluginAPI.registeredPlugins.push({ name: name, main: main })
    },
    registeredPlugins: []
}

LoadAllPlugins();
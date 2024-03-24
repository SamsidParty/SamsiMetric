AutoLoadThisFile();

async function LoadAllPlugins() {
    var pluginList = ParseIndexTree(await (await fetch("./Plugins/index.php")).text(), (e) => e.endsWith(".plugin.js") || e.endsWith(".plugin.jsx"));
    
    for (let i = 0; i < pluginList.length; i++) {
        var l_plugin = pluginList[i];
        var script = await (await fetch("./Plugins/" + l_plugin)).text();

        //Transform Babel
        if (window.Babel && l_plugin.endsWith(".jsx")) {
            script = Babel.transform(script, { presets: ["react"] }).code;
        }

        try {
            eval(script);
        }
        catch {
            //TODO: GUI Error Handler
        }

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
    registeredPlugins: [],
    surfaceMounts: {},
    mountToSurface: (surface, component) => {
        if (PluginAPI.surfaceMounts[surface] == undefined) {
            PluginAPI.surfaceMounts[surface] = [];
        }
        PluginAPI.surfaceMounts[surface].push(component);
    }
}

//A Component That Allows Plugins To Mount Themselves Onto It
function PluginSurface(props) {

    if (PluginAPI.surfaceMounts[props.mount] == undefined) {
        PluginAPI.surfaceMounts[props.mount] = [];
    }

    return (
        <>
            {
                PluginAPI.surfaceMounts[props.mount].map((ComponentToMount, l_index) => {
                    return (<ComponentToMount key={"PluginMountedComponent_" + l_index} />);
                })
            }
        </>
    )
}

LoadAllPlugins();
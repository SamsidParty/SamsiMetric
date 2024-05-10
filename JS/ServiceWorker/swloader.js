AutoLoadThisFile();

RunOnLoad("./JS/ServiceWorker/swloader.js", LoadServiceWorker);

  
var swDependencies = [
    "./JS/ThirdParty/msgpack.js",
    "./JS/ServiceWorker/swmsgpack.js",
    "./JS/ThirdParty/fflate.js",
    "./JS/ServiceWorker/swfflate.js",
];

async function LoadServiceWorker() {

    await LoadDependency("./JS/ThirdParty/workbox.js");

    if ("serviceWorker" in navigator) {
        var wb = new Workbox("./sw.js");
        await wb.register();
        window.CurrentWorkbox = wb;

        await InjectAllDependenciesIntoSW();
    }
}

async function InjectAllDependenciesIntoSW() {
    for (var i = 0; i < swDependencies.length; i++) {
        InjectDependencyIntoSW(swDependencies[i]);
    }
}

async function InjectDependencyIntoSW(dep) {
    if (window.CurrentWorkbox) {
        window.CurrentWorkbox.messageSW({ type: "LOAD_DEPENDENCY", content: await LoadDependency(dep), name: dep });
    }
}
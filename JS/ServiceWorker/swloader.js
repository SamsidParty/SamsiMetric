AutoLoadThisFile();

RunOnLoad("./JS/ServiceWorker/swloader.js", LoadServiceWorker);

  
var swDependencies = [
    "./JS/ThirdParty/msgpack.js",
    "./JS/ThirdParty/fflate.js"
]

async function LoadServiceWorker() {

    await LoadDependency("./JS/ThirdParty/workbox.js");

    if ("serviceWorker" in navigator) {
        var wb = new Workbox("./sw.js");
        await wb.register();
        window.CurrentWorkbox = wb;

        await LoadIntoServiceWorker();
    }
}

//Loads Dependencies Into The Service Worker
async function LoadIntoServiceWorker() {
    for (var i = 0; i < swDependencies.length; i++) {
        window.CurrentWorkbox.messageSW({ type: "LOAD_DEPENDENCY", content: await LoadDependency(swDependencies[i]), name: swDependencies[i] });
    }
}
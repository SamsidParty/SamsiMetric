AutoLoadThisFile();

RunOnLoad("./JS/Common/theming.js", LoadServiceWorker);

  
async function LoadServiceWorker() {

    await LoadDependency("./JS/ThirdParty/workbox.js");

    if ("serviceWorker" in navigator) {
        var wb = new Workbox("./sw.js");
        wb.register();
        window.CurrentWorkbox = wb;
    }
}
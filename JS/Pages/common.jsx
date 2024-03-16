//Loads Common Scripts
//Only For Desktop Platforms
RunOnLoad("./JS/Pages/common.jsx", async () => {
    if (devMode) {
        await LoadDependency("./JS/ThirdParty/react.dev.js");
    }
    else {
        await LoadDependency("./JS/ThirdParty/react.prod.js");
    }

    await LoadDependency("./JS/ThirdParty/msgpack.js");
    await LoadDependency("./JS/Viewer/tooltip.jsx");
});
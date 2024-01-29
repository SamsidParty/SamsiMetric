
window.RunOnLoad = () => {};

if (!window.ReactNativeWebView) {
    document.write("Device Unsupported"); // Not Running From The Webview
}

window.onload = () => {
    setTimeout(StartLoading, 0);
}

//Tells The Host App To Inject Initial Scripts Into The Client
function StartLoading() {
    window.ReactNativeWebView.postMessage(JSON.stringify({
        RunOnGlobal: "loadClient",
        Param1: document.querySelector('meta[name="client-version"]').content
    }));
}
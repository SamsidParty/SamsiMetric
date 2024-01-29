
RunOnLoad("./JS/Mobile/Pages/common.jsx", async () => {

    if (devMode) {
        await LoadDependency("./JS/ThirdParty/react.dev.js");
    }
    else {
        await LoadDependency("./JS/ThirdParty/react.prod.js");
    }

    await LoadDependency("./JS/Mobile/Common/components.jsx");

    if (isApple) {
        await LoadDependency("./JS/Mobile/iOS/themeloader.js");
    }
    else {
        await LoadDependency("./JS/Mobile/Android/themeloader.js");
    }

    var defaultPage = "Login";

    //Check If Current Saved Key Is Valid
    if (localStorage.apikey_value) {
        try {
            var params = {
                "action": "key_info"
            };

            var response = await tfetch(Backend, {
                ...DefaultOptions(),
                headers: DefaultHeaders({ "X-Params": JSON.stringify(params), "X-API-Key": localStorage.apikey_value })
            });

            var json = await response.json();
    
            if (json[0]["type"] == "error")
            {
                alert("You'll Need To Login Again", "Your Saved Credentials Were Invalidated");
            }
            else if (json[0]["type"] == "key_info")
            {
                //Refresh Key, Because Sometimes Permissions / Name Might Have Changed
                LoginWithKeyInfo(json[0]["key_info"], localStorage.apikey_value);
                defaultPage = "App";
            }
        }
        catch (ex) {
            alert("Connection Error", window.devMode ? ex.toString() : "Failed To Connect To The Server, Ensure You Have A Stable Network Connection");
        }
    }

    if (defaultPage == "Login") {
        await LoadDependency("./JS/Mobile/Pages/login.jsx");
    }
    else {
        await LoadDependency("./JS/Mobile/Pages/main.jsx");
    }
});

function App() {

    //Render Native Components
    React.useEffect(() => {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            RunOnGlobal: "setComponentQueue",
            Param1: JSON.stringify(NativeComponentQueue)
        }));
        NativeComponentQueue = [];
    }, []);

    return (
        <>
            {(() => {
                
                if (window.Login) {
                    return (<Login/>);
                }
                else if (window.MainApp) {
                    return (<MainApp/>);
                }

            })()}
        </>
    )
}
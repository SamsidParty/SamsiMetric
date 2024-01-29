
RunOnLoad("./JS/Mobile/Pages/common.jsx", async () => {

    if (devMode) {
        await LoadDependency("./JS/ThirdParty/react.dev.js");
    }
    else {
        await LoadDependency("./JS/ThirdParty/react.prod.js");
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
        await LoadDependency("./JS/Mobile/login.jsx");
    }
    else {
        await LoadDependency("./JS/Mobile/main.jsx");
    }
});

function App() {

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
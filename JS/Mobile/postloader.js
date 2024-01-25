async function LoadAllDependencies() {
    await LoadDependency("./JS/ThirdParty/react.dev.js");
    await LoadDependency("./JS/ThirdParty/nextui.js");
    await LoadDependency("./JS/Viewer/Graphs/common.jsx");
    await LoadDependency("./JS/Viewer/graphmetadata.js"); //TODO: Make RunOnLoad Work So This Loads Automatically
    await LoadDependency("./Fonts/Jetbrains.woff2");
    await LoadDependency("./Fonts/InterVariable.woff2");
    await LoadDependency("./Fonts/Tabler.ttf");
    await LoadDependency("./bundle.css");

    ReferenceComponents();

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
        var pageToLoad = Login;
    }
    else {
        var pageToLoad = App;
    }

    document.body.innerHTML = `<div id="root"></div>`;
    window.root = ReactDOM.createRoot(document.getElementById("root"));
    window.root.render(React.createElement(pageToLoad));
}
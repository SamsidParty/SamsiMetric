
function Login() {

    //Whether The Continue Button Is Disabled
    var [ loginDisabled, setLoginDisabled ] = React.useState(false);
    var [ loginText, setLoginText ] = React.useState("Continue");

    var loginPrompt = async () => {
        setLoginDisabled(true);
        setLoginText("Authenticating...");

        window.ReactNativeWebView.postMessage(JSON.stringify({
            RunOnGlobal: "increaseLoaderCount"
        }));

        //FEATURE (NOT IMPLEMENTED):
        //Detect A Key In The Clipboard And Login With That
        //var clip = await GetFromGlobal("clipboardData");

        //var prompt = await AskForAPIKey();
        var prompt = ["confirm", "default"];

        setLoginText("Connecting...");
        
        if (prompt[0] == "confirm") {
            var params = {
                "action": "key_info"
            };
    
            try {
                var response = await tfetch(Backend, {
                    ...DefaultOptions(),
                    headers: DefaultHeaders({ "X-Params": JSON.stringify(params), "X-API-Key": prompt[1] })
                });
    
                var json = await response.json();
        
                if (json[0]["type"] == "error")
                {
                    alert("Authentication Failed", json[0]["error"]);
                    setLoginText("Try Again");
                }
                else if (json[0]["type"] == "key_info")
                {
                    //alert("Authenticated With Key: " + json[0]["key_info"]["name"]);
                    setLoginText("Welcome, " + json[0]["key_info"]["name"]);
                    LoginWithKeyInfo(json[0]["key_info"], prompt[1]);
                    location.reload();
                }
            }
            catch (ex) {
                alert("Connection Error", window.devMode ? ex.toString() : "Failed To Connect To The Server, Ensure You Have A Stable Network Connection");
                setLoginText("Try Again");
            }
        }

        window.ReactNativeWebView.postMessage(JSON.stringify({
            RunOnGlobal: "decreaseLoaderCount"
        }));

        setLoginDisabled(false);
    }

    document.body.style.overflow = "hidden";

    return (
        <>
            <div className="mobileloginscreen">
                <div className="topLogin">
                    <h4 className="largeIcon">{ isApple ? "\udbc2\udeac" : "\ueb1f" }</h4>
                    <h3>Connect To A<br/> SamsiMetric Server</h3>
                </div>
                <div className="bottomLogin">
                    <NativeButton >Continue</NativeButton>
                </div>


            </div>
        </>
    )
}

async function AskForAPIKey() {
    var keyPrompt = await prompt({
        title: "API Key Required",
        subtitle: "Please Enter Your API Key To Authenticate With " + window.ProductName,
        buttons: [
            {
                text: "Cancel",
                value: "cancel",
                style: 'cancel'
            },
            {
                text: "Confirm",
                value: "confirm",
                style: 'ok'
            }
        ],
        options: {
            type: "plain-text",
            cancelable: false,
            defaultValue: "",
            placeholder: "placeholder"
        }
    });

    return keyPrompt;
}
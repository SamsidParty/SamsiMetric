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
                    LoginWithKeyInfo(json[0]["key_info"]);
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
                <h3>Authenticate With An API Key</h3>
                <div className="centralIcon"><svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-key" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16.555 3.843l3.602 3.602a2.877 2.877 0 0 1 0 4.069l-2.643 2.643a2.877 2.877 0 0 1 -4.069 0l-.301 -.301l-6.558 6.558a2 2 0 0 1 -1.239 .578l-.175 .008h-1.172a1 1 0 0 1 -.993 -.883l-.007 -.117v-1.172a2 2 0 0 1 .467 -1.284l.119 -.13l.414 -.414h2v-2h2v-2l2.144 -2.144l-.301 -.301a2.877 2.877 0 0 1 0 -4.069l2.643 -2.643a2.877 2.877 0 0 1 4.069 0z" /><path d="M15 9h.01" /></svg></div>
                <Button disabled={loginDisabled} css={{ width: "75vw", height: "15vw", fontSize: "4vw" }} onPress={loginPrompt}>{loginText}</Button>
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
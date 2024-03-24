
function LoginModal()
{
    var preloadKey = "";
    var [message, setMessage] = React.useState('');
    var [error, setError] = React.useState('');
    var [status, setStatus] = React.useState('default');

    var onKeyChanged = (e) =>
    {
        setMessage(e.target.value);
    }

    var onEnter = (e) =>
    {
        if (e.key == "Enter")
        {
            onContinue();
        }
    }

    var onContinue = async () =>
    {
        var params = {
            "action": "key_info"
        };

        var response = await fetch(Backend, {
            method: "POST",
            headers: DefaultHeaders({ "X-Params": JSON.stringify(params), "X-API-Key": message || preloadKey })
        })
        var json = await response.json();

        if (json[0]["type"] == "error")
        {
            setError(json[0]["error"]);
            setStatus("error");
        }
        else if (json[0]["type"] == "key_info")
        {
            setError("Authenticated With Key: " + json[0]["key_info"]["name"]);
            setStatus("success");

            LoginWithKeyInfo(json[0]["key_info"], message || preloadKey);

            window.location.href = "./Dashboard";
        }
    };

    if (useFirstRender()) {
        //Login With Stored Key
        preloadKey = localStorage.apikey_value;
    
        //Login With URL Param Key
        var url = new URL(window.location.href);
        preloadKey = url.searchParams.get("key") || preloadKey;

        if (preloadKey){
            setMessage(preloadKey);
            onContinue();
        }
    }



    return (
        <ClientImage background="true" className="setupPage" src="./Images/BackgroundDecoration.jpg">
            <div className="setupContainer">
                <div className="setupModal loginModal">
                    <h1>Sign In To SamsiMetric</h1>
                    <Input size="xl" label={error} status={status} autoFocus={true} bordered placeholder="Enter API Key" onChange={onKeyChanged} onKeyDown={onEnter} initialValue={preloadKey} />
                    <ClientImage className="loginIcon" src="./Images/LoginIcon.png"></ClientImage>
                    <Button size="lg" auto color="primary" onClick={onContinue}>Continue</Button>
                </div>
            </div>
        </ClientImage>
    );
}

function Login()
{
    return (
        <NextUI.NextUIProvider theme={theme}>
            <LoginModal></LoginModal>
        </NextUI.NextUIProvider>
    );
}
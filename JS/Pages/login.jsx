
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
        <Modal
            preventClose
            aria-labelledby="modal-title"
            open="true"
        >
            <Modal.Header>
                <Text id="modal-title" b size={20}>
                    API Key Required
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Input label={error} status={status} aria-label="Enter API Key" autoFocus={true} bordered placeholder="Enter API Key" onChange={onKeyChanged} onKeyDown={onEnter} initialValue={preloadKey} />
            </Modal.Body>
            <Modal.Footer>
                <Button auto color="primary" aria-label="Continue" onClick={onContinue}>Continue</Button>
            </Modal.Footer>
        </Modal>
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
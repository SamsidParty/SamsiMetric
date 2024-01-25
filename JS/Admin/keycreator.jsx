RunOnLoad("./JS/Admin/keycreator.jsx", async () => {
    await LoadDependency("./JS/ThirdParty/qrcode.js");
});

var SampleKey = () =>
{
    return {
        "value": GenerateAPIKey(),
        "id": UUID(),
        "name": "New Key",
        "icon": "default.png",
        "perms": "admin"
    }
}

function APIKeyCreator() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [rawKey, setRawKey] = React.useState(GenerateAPIKey());
    var [copyIcon, setCopyIcon] = React.useState("ti ti-copy");
    var [hashedKey, setHashedKey] = React.useState("");

    if (useFirstRender()) {
        setTimeout(async () => {
            var req = await fetch(Backend, {
                headers: DefaultHeaders({ "X-Params": '{"action":"hash_key"}' }),
                method: "POST",
                body: rawKey
            });
            var json = await req.json();
            var keyObject = SampleKey();
            keyObject.value = json[0].key_hash;
            window.APIKeyData.push(keyObject);
        }, 0);
    }

    var close = () => {
        DataObject["page"] = "ManageAPIKeys";
        setExtRedraw(UUID());
    }

    var copyKey = () => {
        navigator.clipboard?.writeText(rawKey); // Doesn't Work On Insecure Contexts
        setCopyIcon("ti ti-copy-check");
    }

    return (
        <Modal
            aria-labelledby="modal-title"
            width="330px"
            closeButton
            open={true}
            preventClose
            className="createKeyModal"
        >
            <Modal.Header>
                <Text id="modal-title" b size={20}>
                    Save This Information
                </Text>
            </Modal.Header>
            <Modal.Body>
                <div className="createKey">
                    <div className="keyHolder">
                        <div className="qrBox">
                            <ReactQRCode.QRCode size={230} value={`${window.location.href.replace("Dashboard", "Login")}?key=${rawKey}`} viewBox={`0 0 230 230`}/>
                        </div>
                        <div className="keyBox">
                            {rawKey.split("-")[0] + "-*****-*****"}
                            <Button flat auto className="iconButton" onPress={copyKey} ><i className={copyIcon}></i></Button>
                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button auto color="primary" onPress={close}>Create Key</Button>
            </Modal.Footer>
        </Modal>
    )
}

function GenerateAPIKey()
{
    var baseKey = Array.from(
        window.crypto.getRandomValues(new Uint8Array(Math.ceil(32 / 2))),
        (b) => ("0" + (b & 0xFF).toString(16)).slice(-2)
    ).join("").toUpperCase();

    var key = "";
    for (let i = 0; i < baseKey.length; i++)
    {
        if (i % 6 == 0 && i != 0)
        {
            key += "-";
        }
        key += baseKey[i];
    }

    //Year Signature Just For Reference
    key += new Date().getFullYear().toString();

    return key;
}
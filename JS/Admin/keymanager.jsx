var ShouldRefreshKeys = false;
var CurrentlyEditingKeyFile = null;
function ManageKeysModal(props) {

    var [keyItems, setKeyItems] = React.useState([]);
    var [error, setError] = React.useState("");

    var refreshKeys = () => {
        var ki = [];

        CurrentlyEditingKeyFile.forEach((k) => {
            ki.push(<ManageKeysItem setError={setError} keyData={k} key={k.id}></ManageKeysItem>);
        });

        setKeyItems(ki);
        ShouldRefreshKeys = false;
    }

    if (ShouldRefreshKeys) {
        refreshKeys();
    }

    var newKey = () => {

        var data = {
            "value" : UUID(),
            "id" : UUID(),
            "name" : "New Key",
            "perms" : "admin"
        }

        CurrentlyEditingKeyFile.push(data);
        ShouldRefreshKeys = true;
        refreshKeys();
    }

    var save = async () => {
        //Make Sure There Is At Least 1 Admin
        var hasAdmin = false;
        CurrentlyEditingKeyFile.forEach((e) => {       
            if (e.perms == "admin" && !e.name.includes("Revoked Key")) { hasAdmin = true; }

            if (e.name.includes("Revoked Key")) {
                //Save Key To Recently Deleted Locally
                var otherDeletedKeys = JSON.parse(localStorage.recentlyDeleted || "[]");
                otherDeletedKeys.push(props.keyData);
                localStorage.recentlyDeleted = JSON.stringify(otherDeletedKeys);
            }
        });

        if (!hasAdmin) {
            setError("There Must Be At Least 1 Key With Admin Permissions");
            return;
        } 

        //Remove Deleted Keys
        CurrentlyEditingKeyFile = CurrentlyEditingKeyFile.filter((e) => !e.name.includes("Revoked Key"));
        
        setError("Connecting...");

        var response = await fetch(Backend, {
            headers: DefaultHeaders({ "X-Params": '{"action":"key_info"}' }),
            method: "PATCH",
            body: JSON.stringify(CurrentlyEditingKeyFile, null, 2)
        });

        var json = await response.json();

        if (json[0]["type"] == "error") {
            setError(json[0]["error"]);
        }
        else {
            props.onClose();
        }

        setError("");
        
    }

    return (        
        <Modal
            closeButton
            aria-labelledby="modal-title"
            width="900px"
            open={props.open}
            onClose={props.onClose}
        >
            <Modal.Header>
                <Text id="modal-title" b size={20}>
                    Manage API Keys
                </Text>
            </Modal.Header>
            <Modal.Body>
                {keyItems}
            </Modal.Body>
            <Modal.Footer>
                <Text color="error" style={{ marginRight: 'auto', letterSpacing: "0.03rem" }}>{error}</Text>
                <Button flat auto aria-label="New" className="iconButtonLarge" onPress={newKey}><i className="ti ti-plus"></i></Button>
                <Button auto color="primary" aria-label="Save" onPress={save}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}


function ManageKeysItem(props) {

    var [selectedPerm, setSelectedPerm] = React.useState(new Set([""]));
    var [initialKeyName, setInitialKeyName] = React.useState("");
    var [keyToShow, setKeyToShow] = React.useState(props.keyData.value);

    var selectedPermValue = React.useMemo(
      () => Array.from(selectedPerm)[0]
    );

    if (useFirstRender()) {
        setInitialKeyName(props.keyData.name);

        if (props.keyData.perms == "admin") { setSelectedPerm(new Set(["Administrator"])) }
        else if (props.keyData.perms == "viewer") { setSelectedPerm(new Set(["Analytics Viewer"])) }
        else if (props.keyData.perms == "collector") { setSelectedPerm(new Set(["Data Collector"])) }
        else if (props.keyData.perms == "manager") { setSelectedPerm(new Set(["Manager"])) }
    }

    var getCurrentKeyObject = () => {
        var found = null
        CurrentlyEditingKeyFile.forEach((e) => {
            if (e.id == props.keyData.id) { found = e; }
        });
        return found;
    }

    var onDeleted = (e) => {
        if (getCurrentKeyObject().name.includes("Revoked Key")) { return; }
        var newName = "Revoked Key (" + getCurrentKeyObject().name + ")";
        props.setError(`The Key "${getCurrentKeyObject().name}" Will Be Revoked On Save`);
        getCurrentKeyObject().name = newName;
        setInitialKeyName(newName);
        setKeyToShow(newName);
    }

    var onKeyNameChanged = (e) => {
        getCurrentKeyObject().name = e.target.value;
    }

    var onPermChanged = (e) => {

        var targetValue = "admin";

        if (e.currentKey == "Administrator"){
            targetValue = "admin";
        }
        else if (e.currentKey == "Manager"){
            targetValue = "manager";
        }
        else if (e.currentKey == "Analytics Viewer"){
            targetValue = "viewer";
        }
        else if (e.currentKey == "Data Collector"){
            targetValue = "collector";
        }

        getCurrentKeyObject().perms = targetValue;
        setSelectedPerm(e);
    }

    return (
        <Card variant="bordered">
            <Card.Body className="manageKeysItem">
                <Input bordered placeholder="Key Name" onChange={onKeyNameChanged} initialValue={initialKeyName} />
                <Input width="500px" readOnly value={keyToShow} />
                <Dropdown>
                    <Dropdown.Button flat color="secondary">
                        {selectedPermValue}
                    </Dropdown.Button>
                    <Dropdown.Menu
                        aria-label="Permissions"
                        color="secondary"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedPerm}
                        onSelectionChange={onPermChanged}
                    >
                        <Dropdown.Item key="Administrator">Administrator</Dropdown.Item>
                        <Dropdown.Item key="Analytics Viewer">Analytics Viewer</Dropdown.Item>
                        <Dropdown.Item key="Manager">Manager</Dropdown.Item>
                        <Dropdown.Item key="Data Collector">Data Collector</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button flat color="error" auto aria-label="New" className="iconButtonLarge" onPress={onDeleted}><i className="ti ti-trash"></i></Button>

            </Card.Body>
        </Card>
    )
}
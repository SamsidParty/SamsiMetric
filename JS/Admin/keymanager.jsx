function ValuePerms(perm) {
    var targetValue = "admin";

    if (perm == "Administrator")
    {
        targetValue = "admin";
    }
    else if (perm == "Manager")
    {
        targetValue = "manager";
    }
    else if (perm == "Analytics Viewer")
    {
        targetValue = "viewer";
    }
    else if (perm == "Data Collector")
    {
        targetValue = "collector";
    }

    return targetValue;
}

function DisplayPerms(perm) {
    var targetDisplay = "Administrator";

    if (perm == "admin")
    {
        targetDisplay = "Administrator";
    }
    else if (perm == "manager")
    {
        targetDisplay = "Manager";
    }
    else if (perm == "viewer")
    {
        targetDisplay = "Analytics Viewer";
    }
    else if (perm == "collector")
    {
        targetDisplay = "Data Collector";
    }

    return targetDisplay;
}

async function ApplyAPIKeyChanges()
{
    //Make Sure There Is At Least 1 Admin
    var hasAdmin = false;
    window.APIKeyData.forEach((l_key) =>
    {
        if (l_key.perms == "admin" && !l_key.name.includes("Revoked Key")) { hasAdmin = true; }
    });

    if (!hasAdmin)
    {
        return "There Must Be At Least 1 Key With Admin Permissions";
    }

    //Remove Deleted Keys
    window.APIKeyData = window.APIKeyData.filter((e) => !e.name.includes("Revoked Key"));

    var response = await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": '{"action":"key_info"}' }),
        method: "PATCH",
        body: JSON.stringify(window.APIKeyData, null, 2)
    });

    var json = await response.json();

    if (json[0]["type"] == "error")
    {
        return json[0]["error"];
    }
}

function ManageAPIKeys()
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [error, setError] = React.useState("");

    var close = () =>
    {
        DataObject["page"] = null;
        setDataObject(Object.assign({}, DataObject));
    }

    var newKey = async () =>
    {
        //Load Creator Dependency
        if (!window.APIKeyCreator) {
            await LoadDependency("./JS/Admin/keycreator.jsx");
        }
        
        DataObject["page"] = "APIKeyCreator";
        DataObject["pageOverridable"] = "false"; // Prevent Selecting A Workspace From Closing It
        setExtRedraw(UUID());
    }

    var save = async () =>
    {
        var result = await ApplyAPIKeyChanges();
        if (result)
        {
            setError(result);
        }
        else
        {
            close();
        }
    }

    var deleteKey = (l_key) => {
        if (l_key.name.includes("Revoked Key")) { return; }
        l_key.name = "Revoked Key (" + l_key.name + ")";
        setExtRedraw(UUID());
    }

    return (
        <Modal
            width="900px"
            closeButton
            open={true}
            preventClose
            className="manageKeysModal"
        >
            <Modal.Header>
                <Text id="modal-title" b size={20}>
                    Manage API Keys
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Table className="keyTable" css={{ width: "100%", height: "300px", padding: "0px" }} lined shadow={false}>
                    <Table.Header>
                        <Table.Column hideHeader={true}></Table.Column>
                    </Table.Header>
                    <Table.Body>
                        {
                            APIKeyData?.map((l_key, l_index) =>
                            {
                                return !l_key.name.includes("Revoked Key") ? (
                                    <Table.Row key={l_index}>
                                        <Table.Cell>
                                            <div className="keyTableItem">
                                                <div className="keyIcon">
                                                    <CachedIcon src={l_key.icon}></CachedIcon>
                                                </div>
                                                <Input bordered placeholder="Key Name" onChange={(e) => {l_key.name = e.target.value}} initialValue={l_key.name} />
                                                <Dropdown>
                                                    <Dropdown.Button flat color="secondary">
                                                        {DisplayPerms(l_key.perms)}
                                                    </Dropdown.Button>
                                                    <Dropdown.Menu
                                                        aria-label="Permissions"
                                                        color="secondary"
                                                        disallowEmptySelection
                                                        selectionMode="single"
                                                        onSelectionChange={(e) => { l_key.perms = e.currentKey; setExtRedraw(UUID()); }}
                                                    >
                                                        <Dropdown.Item key="admin">Administrator</Dropdown.Item>
                                                        <Dropdown.Item key="viewer">Analytics Viewer</Dropdown.Item>
                                                        <Dropdown.Item key="manager">Manager</Dropdown.Item>
                                                        <Dropdown.Item key="collector">Data Collector</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                                <DeleteButton onDelete={() => deleteKey(l_key)}></DeleteButton>
                                            </div>
                                        </Table.Cell>
                                    </Table.Row>
                                ) : null;
                            })
                        }
                    </Table.Body>
                    <Table.Pagination noMargin align="center" rowsPerPage={Math.min(6, APIKeyData?.length)} />
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Text color="error" style={{ marginRight: 'auto', letterSpacing: "0.03rem" }}>{error}</Text>
                <Button flat auto aria-label="New" className="iconButtonLarge" onPress={newKey}><i className="ti ti-plus"></i></Button>
                <Button flat auto color="primary" onPress={close}>Discard</Button>
                <Button auto color="primary" onPress={save}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}

async function RefreshKeys()
{
    var response = await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": '{"action":"key_info","all":"true"}' })
    });
    var json = await response.json();
    window.APIKeyData = json[0].key_info;
}
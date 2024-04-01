
var workspaceEditMode = false;

RunOnLoad("./JS/Management/workspacemanager.jsx", async () => {
    await LoadDependency("./JS/Management/graphselect.jsx");
    await LoadDependency("./JS/Management/graphsettings.jsx");
    await LoadDependency("./JS/Management/layoutmanager.jsx");
});

async function SyncWorkspaceChanges(DataObject) {
    var paramHeader = { "method": "PATCH", "action": "project_info", "body": "" };

    await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": JSON.stringify(paramHeader) }),
        method: paramHeader.method,
        body: JSON.stringify((DataObject || window.lastDataObject)["schema"], null, 2)
    });
}

function CreateWorkspace(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [newName, setNewName] = React.useState("New Workspace");

    var commit = async () => {
        var id = UUID();
        CurrentProject(DataObject).workspaces.push(
            {
                name: newName,
                id: id,
                tag: "primary",
                icon: "default.png",
                layouts: []
            }
        );
        CurrentProject(DataObject).workspaceorder.push(id);
        setDataObject(Object.assign({}, DataObject));
        await SyncWorkspaceChanges(DataObject);
        setIsOpen(false);
        await RefreshData();
    }

    return (
        <>
            <Tooltip ttid={"addworkspace"} {...TTContent("static", "Create Workspace")}>
                <Button style={props.style} color={props.workspaceTag} flat auto className="iconButton" onPress={() => setIsOpen(true)}><i className="ti ti-plus"></i></Button>
            </Tooltip>
            <Modal closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Create Workspace
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>
                    <Input bordered placeholder="Workspace Name" label="Workspace Name" onChange={(e) => setNewName(e.target.value)} initialValue={newName} />
                </Modal.Body>
                <Modal.Footer>
                    <Button auto onPress={commit}>Create</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
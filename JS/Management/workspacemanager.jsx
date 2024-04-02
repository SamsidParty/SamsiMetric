
var workspaceEditMode = false;
var manageWorkspaceBackup = null;

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

function WorkspaceEditor(props)
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);

    var changeColor = (e) => {
        var ws = ArrayValue(CurrentProject(DataObject).workspaces, "id", props.workspace.id);
        ws.tag = e.target.value;
        setDataObject(Object.assign({}, DataObject));
    }
    
    var startEditing = () => {
        //Create A Backup Of The Current Data
        //Used To Discard Changes
        manageWorkspaceBackup = Object.assign({}, ArrayValue(CurrentProject(DataObject).workspaces, "id", props.workspace.id));
        setIsOpen(true);
    }

    var apply = async () => {
        //Send Changes To Server
        await SyncWorkspaceChanges();
        setDataObject(Object.assign({}, DataObject));
        setIsOpen(false);
    }

    var discard = () => {
        //Restore From Backup
        var ws = ArrayIndex(CurrentProject(DataObject).workspaces, "id", props.workspace.id);
        CurrentProject(DataObject).workspaces[ws] = Object.assign({}, manageWorkspaceBackup);
        setDataObject(Object.assign({}, DataObject));
        setIsOpen(false);
    }

    return (
        <>
            <Button onPress={startEditing} color={props.workspace.tag} flat auto className="iconButton iconButtonLarge">
                <i className="ti ti-edit"></i>
            </Button>
            <Modal closeButton open={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Edit Workspace
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">Color</p>
                    <ColorBar onChange={changeColor} value={props.workspace.tag} data-key={props.workspace.tag} />
                    <div className="flexx fillx fjend">
                        <Button auto flat onPress={discard}>Discard</Button>
                        <NextUI.Spacer x={0.5} />
                        <Button auto onPress={apply}>Save</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
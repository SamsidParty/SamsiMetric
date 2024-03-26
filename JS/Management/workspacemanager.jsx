
var workspaceEditMode = false;

RunOnLoad("./JS/Management/workspacemanager.jsx", async () => {
    await LoadDependency("./JS/Management/graphselect.jsx");
    await LoadDependency("./JS/Management/graphsettings.jsx");
    await LoadDependency("./JS/Management/layoutmanager.jsx");
});

async function SyncWorkspaceChanges(DataObject) {
    var paramHeader = {"method":"PATCH","action":"project_info","body":""};

    await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": JSON.stringify(paramHeader) }),
        method: paramHeader.method,
        body: JSON.stringify((DataObject || window.lastDataObject)["schema"], null, 2)
    });
}
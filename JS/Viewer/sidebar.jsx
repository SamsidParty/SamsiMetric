function Sidebar()
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var switchProject = (e) =>
    {
        var proj = Array.from(e)[0];
        DataObject["selected_project"] = proj;
        setDataObject(Object.assign({}, DataObject));
    }

    var editProject = () =>
    {
        manageProjectsBackup = JSON.parse(JSON.stringify(DataObject));
        manageProjectsQueue = [];
        DataObject["page"] = "ManageProject";
        setExtRedraw(UUID());
    }

    var workspaceTag = CurrentWorkspace(DataObject)?.tag || "secondary";

    return (
        <div className="sidebar">
            <div className="flexx gap10">
                <Tooltip ttid="favicon" {...TTContent("favicon")}>
                    <ClientImage width={40} src="./Images/FullFavicon.png" />
                </Tooltip>
                <Dropdown>
                    <Dropdown.Button color={workspaceTag} flat>{ArrayValue(DataObject.schema, "id", DataObject["selected_project"]).name}</Dropdown.Button>
                    <Dropdown.Menu selectionMode="single" onSelectionChange={switchProject} disallowEmptySelection aria-label="Project" items={DataObject["schema"]}>
                        {(item) => (
                            <Dropdown.Item
                                key={item["id"]}
                                color="default"
                            >
                                {item["name"]}
                            </Dropdown.Item>
                        )}
                    </Dropdown.Menu>
                </Dropdown>

                { /* Manage Project Icon, Only Shows When We Have Permissions To Do It */}
                {
                    (() =>
                    {

                        if ((localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && DataIsValid()) 
                        {
                            return (
                                <Tooltip ttid="editproject" {...TTContent("static", "Edit Project")}>
                                    <Button onPress={editProject} color={workspaceTag} className="iconButtonLarge" flat auto>
                                        <i className="ti ti-edit"></i>
                                    </Button>
                                </Tooltip>
                            )
                        }
                    })()
                }
            </div>
            <NextUI.Spacer y={3} />

            <SidebarWorkspaces workspaceTag={workspaceTag} ></SidebarWorkspaces>

            <NextUI.Spacer y={1} />
        </div>
    )
}

function SidebarWorkspaces(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [workspaceAnimation, setWorkspaceAnimation] = React.useState("none");
    var [reorderMode, setReorderMode] = React.useState(false);
    var [callbackMethod, setCallbackMethod] = React.useState([() => {}]);

    var workspaces = ArrayValue(DataObject["schema"], "id", DataObject["selected_project"])["workspaces"] || [];

    var reorderWorkspaces = async () =>
    {
        if (reorderMode)
        {
            //Apply New Order
            var newState = callbackMethod[0]();
            var newOrder = [];
            newState.forEach((l_state) => { newOrder.push(l_state.id); });
            CurrentProject(DataObject).workspaceorder = newOrder;
            setDataObject(Object.assign({}, DataObject));

            //Disable Reorder Mode
            setReorderMode(false);

            //Submit New Order To Server
            //Will Throw If projectmanager.jsx Is Not Loaded
            if (window.ApplyProjectChanges) {
                await ApplyProjectChanges();
            }
        }
        else
        {
            //Load React SortableJS If Not Loaded
            if (!window.ReactSortableJS) {
                await LoadDependency("./JS/ThirdParty/sort.js");
            }

            //Enable Reorder Mode
            setReorderMode(true);
        }
    }

    return (
        <div className="sidebarWorkspaces">
            <div className="sidebarWorkspacesHeader" style={{ width: "80%" }}>
                <h3 className="boldText taleft">WORKSPACES</h3>

                { /* //Reorder And Add Workspace Buttons, Only Shown When We Have Permissions To Do It  */}
                {
                    (() =>
                    {

                        if ((localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && DataIsValid())
                        {
                            //Always Show Plus Button If There Are No Workspaces
                            //Never Show Reorder Button If There Are No Workspaces
                            var hasNoWorkspaces = CurrentProject(DataObject).workspaces.length < 1;

                            return (
                                <>
                                    <Tooltip ttid={"reorderworkspaces"} {...TTContent("static", "Reorder Workspaces")}>
                                        <Button onPress={reorderWorkspaces} style={(hasNoWorkspaces) ? { display: "none" } : {}} color={props.workspaceTag} flat auto className="iconButton"><i className={reorderMode ? "ti ti-check" : "ti ti-menu-order"}></i></Button>
                                    </Tooltip>
                                    <Tooltip ttid={"addworkspace"} {...TTContent("static", "Create Workspace")}>
                                        <Button style={(hasNoWorkspaces) ? { display: "flex" } : {}} color={props.workspaceTag} flat auto className="iconButton"><i className="ti ti-plus"></i></Button>
                                    </Tooltip>
                                </>
                            )
                        }
                    })()
                }

            </div>

            <div className={reorderMode ? "workspaceList reorderWorkspaceList" : "workspaceList"}>
                {
                    //Render A List Of Buttons If Not In Reorder Mode
                    //Render A Sortable List In Reorder Mode
                    (reorderMode && window.ReactSortableJS) ?
                    (<SidebarWorkspaceListReorderable setCallbackMethod={setCallbackMethod} workspaces={workspaces} workspaceorder={CurrentProject(DataObject).workspaceorder || []}/>) :
                    (<SidebarWorkspaceList workspaces={workspaces} workspaceorder={CurrentProject(DataObject).workspaceorder || []} />)
                }
            </div>

        </div>
    )

}

function SidebarWorkspaceList(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <>
            {
                props.workspaceorder.map((l_wsid) =>
                {
                    var workspace = ArrayValue(props.workspaces, "id", l_wsid);
                    return (
                        <Button
                            flat
                            className="workspaceButton"
                            color={workspace.tag}
                            key={l_wsid}

                            onPress={
                                () =>
                                {
                                    localStorage.lastWorkspace = l_wsid;
                                    DataObject["selected_workspace"] = l_wsid;
                                    setDataObject(Object.assign({}, DataObject));
                                }
                            }

                        >
                            <div style={{ backgroundColor: tagColors[workspace.tag] }} className="workspaceButtonIcon">
                                <CachedIcon src={workspace.icon} ></CachedIcon>
                            </div>
                            <h3>{workspace.name}</h3>

                        </Button>);
                })
            }
        </>
    )
}

function SidebarWorkspaceListReorderable(props)
{
    var listState = [];
    props.workspaceorder.forEach((l_wsid) => {
        var workspace = ArrayValue(props.workspaces, "id", l_wsid);
        listState.push({
            id: l_wsid,
            name: workspace.name
        });
    });

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    const [state, setState] = React.useState(listState);

    //The Parent Will Run This Function When The Checkmark Is Pressed
    //Return The Current State
    setTimeout(() => {
        props.setCallbackMethod([() => {
            return state;
        }]);
    }, 0);

    return (
        <ReactSortableJS.ReactSortable
        list={state} setList={setState}
        className = "workspaceSortable"
        >
            {
                state.map((l_state) =>
                {
                    var l_wsid = l_state.id;
                    var workspace = ArrayValue(props.workspaces, "id", l_wsid);
                    return (

                            <Button
                                flat
                                className="workspaceButton"
                                color={workspace.tag}
                                key={l_wsid}
                            >
                                <div style={{ backgroundColor: tagColors[workspace.tag] }} className="workspaceButtonIcon">
                                    <CachedIcon src={workspace.icon} ></CachedIcon>
                                </div>
                                <h3>{workspace.name}</h3>
                            </Button>

                    );
                })
            }
        </ReactSortableJS.ReactSortable>
    )
}
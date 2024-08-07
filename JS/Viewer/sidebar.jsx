function Sidebar() {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var switchProject = (e) => {
        var proj = Array.from(e)[0];
        DataObject["selected_project"] = proj;
        setDataObject(Object.assign({}, DataObject));
    }

    var editProject = () => {
        manageProjectsBackup = JSON.parse(JSON.stringify(DataObject));
        manageProjectsQueue = [];
        DataObject["page"] = "ManageProject";
        DataObject["pageOverridable"] = "false"; // Prevent Selecting A Workspace From Closing It
        setExtRedraw(UUID());
    }

    var workspaceTag = CurrentWorkspace(DataObject)?.tag || "secondary";

    return (
        <div className="sidebar">
            <div className="flexx gap10 facenter fjcenter fillx" style={{ height: "100px" }}>
                <Tooltip ttid="favicon" {...TTContent("favicon")}>
                    <ClientImage width={35} src="./Images/FullFavicon.svg" />
                </Tooltip>
                <AutoTextSize mode="oneline" style={{ margin: 0, fontWeight: 500 }} maxFontSizePx={24}>{ProductName}</AutoTextSize>
            </div>
            <div className="flexx gap10">
                <Tooltip ttid="selectproject" {...TTContent("static", "Select Project")}>
                    <Dropdown>
                        <Dropdown.Button css={{ width: "160px", display: (DataIsValid() ? "flex" : "none") }} color={workspaceTag} flat>{ArrayValue(DataObject.schema, "id", DataObject["selected_project"]).name}</Dropdown.Button>
                        <Dropdown.Menu onAction={() => window.location.href = "./ProjectSelect"} selectionMode="single" disallowEmptySelection aria-label="Project">
                            <Dropdown.Item color="default">
                                <i className="ti ti-color-swatch"></i>Open Project Selector
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Tooltip>

                <Skeleton width="160px" contrast />

                { /* Manage Project Icon, Only Shows When We Have Permissions To Do It */}
                {
                    (() => {

                        if ((localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager")) {
                            if (DataIsValid()) {
                                return (
                                    <Tooltip ttid="editproject" {...TTContent("static", "Edit Project")}>
                                        <Button onPress={editProject} color={workspaceTag} className="iconButtonLarge" flat auto>
                                            <i className="ti ti-edit"></i>
                                        </Button>
                                    </Tooltip>
                                )
                            }
                            else {
                                return (<Skeleton width="40px" contrast />);
                            }
                        }
                    })()
                }
            </div>
            <NextUI.Spacer y={3} />

            <SidebarWorkspaces workspaceTag={workspaceTag} ></SidebarWorkspaces>

            <NextUI.Spacer y={1} />

            <PluginSurface mount="sidebar" />
        </div>
    )
}

function SidebarWorkspaces(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [workspaceAnimation, setWorkspaceAnimation] = React.useState("none");
    var [reorderMode, setReorderMode] = React.useState(false);
    var [callbackMethod, setCallbackMethod] = React.useState([() => { }]);

    var workspaces = ArrayValue(DataObject["schema"], "id", DataObject["selected_project"])["workspaces"] || [];

    var reorderWorkspaces = async () => {
        if (reorderMode) {
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
        else {
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
                    (() => {

                        if ((localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && DataIsValid()) {
                            //Always Show Plus Button If There Are No Workspaces
                            //Never Show Reorder Button If There Are No Workspaces
                            var hasNoWorkspaces = CurrentProject(DataObject)?.workspaces?.length < 1;

                            return (
                                <>
                                    <Tooltip ttid={"reorderworkspaces"} {...TTContent("static", "Reorder Workspaces")}>
                                        <Button onPress={reorderWorkspaces} style={(hasNoWorkspaces) ? { display: "none" } : {}} color={props.workspaceTag} flat auto className="iconButton"><i className={reorderMode ? "ti ti-check" : "ti ti-menu-order"}></i></Button>
                                    </Tooltip>
                                    <CreateWorkspace style={(hasNoWorkspaces) ? { display: "flex" } : {}} {...props} />
                                </>
                            )
                        }
                    })()
                }

            </div>

            <div className={reorderMode ? "workspaceList reorderWorkspaceList" : "workspaceList"}>
                {
                    //Show Image If There Are No Workspaces
                    ((localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && DataIsValid() && CurrentProject(DataObject)?.workspaces?.length < 1) ?
                        (<ClientImage style={{ borderRadius: "10px" }} src="./Images/TooltipNoWorkspaces.png" />)
                        : null
                }

                <SidebarWorkspaceSkeletons />

                {
                    //Render A List Of Buttons If Not In Reorder Mode
                    //Render A Sortable List In Reorder Mode
                    (reorderMode && window.ReactSortableJS) ?
                        (<SidebarWorkspaceListReorderable setCallbackMethod={setCallbackMethod} workspaces={workspaces} workspaceorder={CurrentProject(DataObject).workspaceorder || []} />) :
                        (<SidebarWorkspaceList workspaces={workspaces} workspaceorder={CurrentProject(DataObject).workspaceorder || []} />)
                }
            </div>

        </div>
    )

}

function SidebarWorkspaceSkeletons() {
    return (
        <>
            {
                (Array(parseInt(localStorage.lastWorkspaceCount) || 3).fill(null)).map((l_val, l_index) => {
                    return (<Skeleton key={l_index.toString()} contrast></Skeleton>);
                })
            }

        </>
    )
}

function SidebarWorkspaceList(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    if (props.workspaces.length > 0) {
        localStorage.lastWorkspaceCount = props.workspaces.length;
    }

    return (
        <>
            {
                props.workspaceorder.map((l_wsid) => {
                    var workspace = ArrayValue(props.workspaces, "id", l_wsid);
                    return (
                        <Button
                            flat
                            className="workspaceButton"
                            color={workspace.tag}
                            key={l_wsid}

                            onPress={
                                () => {

                                    if (DataObject["pageOverridable"] && DataObject["pageOverridable"] == "true") {
                                        DataObject["page"] = null;
                                    }

                                    //Cache Workspace Information
                                    localStorage.lastWorkspace = l_wsid;
                                    localStorage.lastWorkspaceName = workspace.name;
                                    localStorage.lastWorkspaceTag = workspace.tag;
                                    localStorage.lastWorkspaceLayouts = JSON.stringify(workspace.layouts.map((l_layout) => {
                                        //Replace All Graphs With Skeleton Graphs
                                        l_layout = Object.assign({}, l_layout);
                                        l_layout.graphs = l_layout.graphs.map(() => { return { type: "skeleton" }; });
                                        return l_layout;
                                    }));

                                    DataObject["selected_workspace"] = l_wsid;
                                    setDataObject(Object.assign({}, DataObject));
                                }
                            }

                        >
                            <div key={UUID()} style={{ backgroundColor: tagColors[workspace.tag] }} className="workspaceButtonIcon">
                                <CachedIcon src={workspace.icon} ></CachedIcon>
                            </div>
                            <h3>{workspace.name}</h3>
                            {
                                (localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") ?
                                    (<WorkspaceEditor {...props} workspace={workspace} />) :
                                    null
                            }

                        </Button>);
                })
            }
        </>
    )
}

function SidebarWorkspaceListReorderable(props) {
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
            className="workspaceSortable"
        >
            {
                state.map((l_state) => {
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
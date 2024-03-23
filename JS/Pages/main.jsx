
var DataContext = React.createContext(null);
var DummyData = {
    "schema": [],
    "data": {

    },
    "selected_project": ""
}

var extDataObject;
var setExtDataObject;
var setExtRedraw;
var dataStatus = "success";


async function PageInit() {
    await LoadDependency("./JS/ThirdParty/autotextsize.js");
    await LoadDependency("./JS/Viewer/sidebar.jsx");
    await LoadDependency("./JS/Common/errorhandler.jsx");

    if (localStorage.apikey_perms == "admin") {
        await LoadDependency("./JS/Admin/keymanager.jsx");
    }

    if (localStorage.apikey_perms == "manager" || localStorage.apikey_perms == "admin") {
        await LoadDependency("./JS/Management/iconmanager.jsx");
        await LoadDependency("./JS/Management/projectmanager.jsx");
        await LoadDependency("./JS/Management/editworkspace.jsx");
    }
}

function Topbar()
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var keyName = localStorage.apikey_name;

    var keyDropdown = [
        ... (localStorage.apikey_perms == "admin") ? [{ key: "editkeys", name: "Manage API Keys", icon: "ti ti-edit-circle" }] : [],
        { key: "signout", name: "Sign Out", icon: "ti ti-logout" }
    ];

    var onSelect = async (e) =>
    {
        if (e == "editkeys")
        {
            await RefreshKeys();
            DataObject["page"] = "ManageAPIKeys";
            setExtRedraw(UUID());
        }
        else if (e == "signout") {
            localStorage.clear();
            location.reload();
        }
    }


    var workspaceTag = CurrentWorkspace(DataObject)?.tag || "secondary";
    var databaseTag = "error";
    var databaseIcon = "database-exclamation";

    if (dataStatus == "syncing") {
        var databaseTag = "secondary";
        var databaseIcon = "database-cog";
    }
    else if (dataStatus == "success") {
        var databaseTag = workspaceTag;
        var databaseIcon = "database";
    }

    return (
        <div className="topbar">

            <PluginSurface mount="topbar" />

            {       
                localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager" ?
                (
                    <Tooltip ttid="lockworkspace" {...TTContent("lockworkspace")}>
                        <Button auto flat color={workspaceTag} onPress={() => { window.workspaceEditMode = !window.workspaceEditMode; setExtRedraw(UUID()); }} className="iconButtonLarge"><i className={"ti ti-lock" + (window.workspaceEditMode ? "-open" : "")}></i></Button>
                    </Tooltip>
                )
                : <></>
            }

            <Tooltip ttid="databasestatus" {...TTContent("static", "Database Status")}>
                <Button auto flat color={databaseTag} onPress={() => RefreshData(true)} className="iconButtonLarge"><i className={"ti ti-" + databaseIcon}></i></Button>
            </Tooltip>

            <Dropdown>
                <Dropdown.Trigger>
                    <Button auto flat color={workspaceTag}>
                        &#xeac7; &nbsp;&nbsp; {keyName}
                    </Button>
                </Dropdown.Trigger>
                <Dropdown.Menu items={keyDropdown} onAction={onSelect}>
                    {(item) => (
                        <Dropdown.Item className="dropdownItem" key={item.key} color={item.key === "signout" ? "error" : "default"} >
                            <p className={item.icon}></p>
                            <p>{item.name}</p>
                        </Dropdown.Item>
                    )}
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
}



function DashboardLayout(props)
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var workspace = CurrentWorkspace(DataObject);
    LoadGraphDependencies(workspace);

    return (
        <div className="dashboardLayout">
            {
                CurrentWorkspace(DataObject)?.layouts?.map((l_layout, l_index) => {
                    var LayoutToRender = window.WorkspaceLayouts[l_layout.type];
                    return (<LayoutToRender key={`${l_layout.type}_${l_index}_${workspace.id}`} {...props} workspace={workspace} layout={l_layout} layoutIndex={l_index}></LayoutToRender>);
                })
            }
            {
                !!window.workspaceEditMode ? 
                (
                    <div className="flexx facenter fjcenter fillx">
                        <AddLayout/>
                    </div>
                )
                : (<></>)
            }
        </div>
    );
}

function CurrentLayout(props)
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    if (DataObject["page"])
    {
        var DashboardCustomPage = window[DataObject["page"]];
        return (<DashboardCustomPage {...props} />);
    }
    else
    {
        return (<DashboardLayout {...props} />);
    }
}

function Dashboard()
{
    return (
        <div className="dashboard">
            {CurrentLayout({})}
        </div>
    )
}


function App()
{

    //Contains Project Schema & User Data
    var [DataObject, setDataObject] = React.useState(DummyData);
    var [Redraw, setRedraw] = React.useState("");
    extDataObject = DataObject;
    setExtDataObject = setDataObject;
    setExtRedraw = setRedraw;

    if (useFirstRender())
    {
        setTimeout(async () =>
        {
            await RefreshData();

            //Check If Last Project Is Valid
            if (DataIsValid() && ArrayValue(extDataObject["schema"], "id", localStorage.lastProject).length == 0){
                localStorage.lastProject = extDataObject["schema"][0]["id"];
            }

            //Check If Last Workspace Is Valid
            var project = ArrayValue(extDataObject["schema"], "id", localStorage.lastProject);
            if (DataIsValid() && ArrayValue(project["workspaces"], "id", localStorage.lastWorkspace).length == 0){
                localStorage.lastWorkspace = project["workspaces"][0];
            }

            //Make Some Changes
            extDataObject["selected_project"] = localStorage.lastProject;
            extDataObject["selected_workspace"] = localStorage.lastWorkspace;
            setDataObject(Object.assign({}, extDataObject));
        }, 0);
    }

    return (

        <DataContext.Provider value={{ DataObject: DataObject, setDataObject: setDataObject }}>
            <NextUI.NextUIProvider theme={theme}>
                <Sidebar></Sidebar>
                <Topbar></Topbar>
                <Dashboard></Dashboard>
            </NextUI.NextUIProvider>
        </DataContext.Provider>

    );
};
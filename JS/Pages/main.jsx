
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
    await LoadDependency("./JS/Viewer/topbar.jsx");
    await LoadDependency("./JS/Viewer/sidebar.jsx");
    await LoadDependency("./JS/Common/errorhandler.jsx");

    if (localStorage.apikey_perms == "admin") {
        await LoadDependency("./JS/Admin/keymanager.jsx");
    }

    if (localStorage.apikey_perms == "manager" || localStorage.apikey_perms == "admin") {
        await LoadDependency("./JS/Management/common.jsx");
    }
}


function DashboardLayout(props)
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var workspace = CurrentWorkspace(DataObject);
    LoadGraphDependencies(workspace);

    return (
        <div className="dashboardLayout">
            {
                //Show Workspace Name On Mobile
                window.MobileWorkspaceHeader ? 
                <MobileWorkspaceHeader workspace={workspace} /> : null
            }
            {
                //Render Layouts (Or Saved Skeleton Layouts If There Are None)
                (workspace?.layouts || JSON.parse(localStorage.lastWorkspaceLayouts || "[]")).map((l_layout, l_index) => {
                    var LayoutToRender = GetMetadataFromLayout(l_layout).render();

                    if (isMobile) {
                        LayoutToRender = MobileLayout;
                    }

                    return (<LayoutToRender key={`${l_layout.type}_${l_index}_${workspace?.id}`} {...props} workspace={workspace} layout={l_layout} layoutIndex={l_index}></LayoutToRender>);
                })
            }
            {
                //Show "Add Layout" Button
                !!window.workspaceEditMode ? 
                (
                    <div className="flexx facenter fjcenter fillx">
                        <AddLayout/>
                    </div>
                )
                : null
            }
            {
                //Show "Nothing Here Yet"
                !(workspace?.layouts?.length > 0) ? 
                (
                    <NothingHere text="Add A Layout To This Workspace, It'll Show Up Here"></NothingHere>
                )
                : null
            }
            <NextUI.Spacer y={1}/>
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

            //Restore Previous Pages
            extDataObject["selected_project"] = localStorage.lastProject;
            extDataObject["selected_workspace"] = localStorage.lastWorkspace;
            setDataObject(Object.assign({}, extDataObject));
        }, 0);
    }

    return (

        <DataContext.Provider value={{ DataObject: DataObject, setDataObject: setDataObject }}>
            <BasicPageChecks></BasicPageChecks>
            <NextUI.NextUIProvider theme={theme}>
                <Sidebar></Sidebar>
                {
                    //Hide Topbar On Mobile
                    isDesktop ? 
                    <Topbar></Topbar> : null
                }
                <Dashboard></Dashboard>
            </NextUI.NextUIProvider>
        </DataContext.Provider>

    );
};
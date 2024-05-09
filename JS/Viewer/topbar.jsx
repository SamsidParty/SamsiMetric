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
            DataObject["pageOverridable"] = "false"; // Prevent Selecting A Workspace From Closing It
            setExtRedraw(UUID());
        }
        else if (e == "signout") {
            localStorage.clear();
            location.reload();
        }
    }


    var workspaceTag = CurrentWorkspace(DataObject)?.tag || localStorage.lastWorkspaceTag || "secondary";
    var databaseTag = workspaceTag;
    var databaseIcon = "database-cog";

    //Only Make Icons Purple On Subsequent Refreshes
    //Prevents Flashing On First Load
    if (dataStatus == "syncing" && DataIsValid()) {
        var databaseTag = "secondary";
        var databaseIcon = "database-cog";
    }
    else if (dataStatus == "success") {
        var databaseTag = workspaceTag;
        var databaseIcon = "database";
    }
    else if (dataStatus == "error") {
        var databaseTag = "error";
        var databaseIcon = "database-exclamation";
    }

    return (
        <div className="topbar">

            <PluginSurface mount="topbar" />

            {       
                (localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && CurrentWorkspace(DataObject) != null ?
                (
                    <Tooltip ttid="lockworkspace" {...TTContent("lockworkspace")}>
                        <Button auto flat color={workspaceTag} onPress={() => { window.workspaceEditMode = !window.workspaceEditMode; setExtRedraw(UUID()); }} className="iconButtonLarge"><i className={"ti ti-lock" + (window.workspaceEditMode ? "-open" : "")}></i></Button>
                    </Tooltip>
                )
                : <></>
            }

            <Tooltip ttid="databasestatus" {...TTContent("static", "Refresh Data")}>
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



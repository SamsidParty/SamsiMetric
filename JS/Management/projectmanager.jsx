RunOnLoad("./JS/Management/projectmanager.jsx", async () => {
    await LoadDependency("./JS/Management/metricmanager.jsx");
});

var manageProjectsBackup = {};
var manageProjectsQueue = []

async function ApplyProjectChanges()
{
    StripInvalidDependencies();

    //Upload Icons To Server
    var iconQueue = [];
    CurrentProject(window.lastDataObject).metrics.forEach((l_metric) =>
    {
        if (l_metric.icon.startsWith("data:image/png"))
        {
            var iconData = {
                id: UUID().replaceAll("-", "_"),
                value: l_metric.icon.replace(/^data:image\/?[A-z]*;base64,/, "")
            }
            iconQueue.push(iconData);

            l_metric.icon = iconData.id + ".png";
        }
    });
    if (iconQueue.length > 0)
    {
        manageProjectsQueue.push({ "method": "POST", "action": "upload_icon", "body": JSON.stringify(iconQueue, null, 2) })
    }

    manageProjectsQueue.push({ "method": "PATCH", "action": "project_info", "body": JSON.stringify(window.lastDataObject["schema"], null, 2) })

    for (var i = 0; i < manageProjectsQueue.length; i++)
    {

        var paramHeader = Object.assign({}, manageProjectsQueue[i]);
        paramHeader.body = "";

        await fetch(Backend, {
            headers: DefaultHeaders({ "X-Params": JSON.stringify(paramHeader) }),
            method: manageProjectsQueue[i]["method"],
            body: manageProjectsQueue[i]["body"] || ""
        });
    }

    manageProjectsQueue = [];
    
    //Close Project Manager
    await RefreshData();
    window.lastDataObject["page"] = null;
    window.setExtDataObject(Object.assign({}, window.lastDataObject));
}

function ManageProject()
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var discard = () =>
    {
        setDataObject(manageProjectsBackup);
        manageProjectsQueue = [];
    }

    var changeName = (e) =>
    {
        CurrentProject(DataObject)["name"] = e.target.value;
    }

    return (
        <Modal open={true} closeButton preventClose width="380px" className="manageProject">
            <Modal.Header>
                <Text b id="modal-title" size={20}>
                    Manage Project
                </Text>
            </Modal.Header>
            <Modal.Body>
                <div className="flexy fillx fjcenter fastart">
                    <Input bordered label="Project Name" placeholder="eg: My App" onChange={changeName} initialValue={CurrentProject(DataObject)["name"]} />
                    <NextUI.Spacer x={0.5} />
                    <div className={`metricPreview ${(CurrentProject(DataObject).metrics.length > 0) ? "hasMetrics" : "noMetrics"}`}> { /* Show Different UI If There Are No Metrics */}
                        <div className="metricPreviewTrackHolder">
                            <MetricPreviewTrack index={0} />
                            <MetricPreviewTrack index={1} />
                            <MetricPreviewTrack index={2} />
                        </div>
                        <ClientImage className="tooltipNoMetrics" src="./Images/TooltipNoMetrics.png" />

                        <div className="metricPreviewContent">
                            <div className="metricStatus onlyShowIfHasMetrics">
                                <h3 className="boldText">Metrics & Groups</h3>
                            </div>
                            <div className="metricPreviewButtons">
                                <ManageMetrics />
                                <ManageGroups />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flexx fillx fjend">
                    <Button auto flat onPress={discard}>Discard</Button>
                    <NextUI.Spacer x={0.5} />
                    <Button auto onPress={ApplyProjectChanges}>Save</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

// A Long Horizontal List Of Metric Icons / Colors
function MetricPreviewTrack(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metricsToDraw = [];

    for (let i = 0; i < CurrentProject(DataObject).metrics.length; i++) 
    {
        var modI = i + (props.index * Math.floor(CurrentProject(DataObject).metrics.length / 3));
        var mtd = SafeSelect(CurrentProject(DataObject).metrics, modI);
        metricsToDraw.push(mtd);
    }

    ShuffleArray(metricsToDraw);

    var minAmount = 40; // Minimum Number Of Children
    minAmount = minAmount - (minAmount % metricsToDraw.length); // Find LCM
    var amountDuplicated = 0;

    //Duplicate Array Elements Until We Reach The Min Amount
    while (metricsToDraw.length < minAmount)
    {
        metricsToDraw.push(SafeSelect(metricsToDraw, amountDuplicated));
        amountDuplicated += 1;
    }

    //Make Sure First Element Is The Same As The Last For Looping
    metricsToDraw[metricsToDraw.length - 1] = metricsToDraw[0];

    return (
        <>
            <div className={`metricPreviewTrack metricPreviewTrack${props.index}`}>
                {
                    metricsToDraw.map((l_metric) =>
                    {
                        return (
                            <div key={UUID()} className="metricIcon" style={{ backgroundColor: tagColors[l_metric.tag] }}>
                                <CachedIcon src={GetMetricPreviewIcon(l_metric)}/>
                            </div>
                        );
                    })
                }
            </div>
        </>
    )
}

function StripInvalidDependencies(metric)
{

    if (!metric)
    {
        //Run On All Metrics
        CurrentProject(window.lastDataObject).metrics.forEach((l_metric) =>
        {
            StripInvalidDependencies(l_metric);
        });

        //Also Run On Workspaces
        CurrentProject(window.lastDataObject).workspaces.forEach((l_workspace) =>
        {
            l_workspace.layouts.forEach((l_layout) =>
            {
                l_layout.graphs.forEach((l_graph) =>
                {
                    if (l_graph && ArrayValue(CurrentProject(window.lastDataObject).metrics, "id", l_graph.for).length == 0)
                    {
                        //Clear Graph While Keeping Reference (https://stackoverflow.com/a/28570479)
                        for (var variableKey in l_graph)
                        {
                            if (l_graph.hasOwnProperty(variableKey))
                            {
                                delete l_graph[variableKey];
                            }
                        }
                    }
                });
            });
        });

        return;
    }

    metric.dependencies = metric.dependencies.filter(l_dependency =>
    {
        return ArrayValue(CurrentProject(window.lastDataObject).metrics, "id", l_dependency).length != 0;
    });
}

function IconSelect(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [filterText, setFilterText] = React.useState("");
    var [loadAmount, setLoadAmount] = React.useState(117);

    var currentlyLoaded = 0;

    var openEditor = async () =>
    {
        if (!window.tablerIconDatabase)
        {
            await LoadDependency("./JS/ThirdParty/tablericons.js");
        }

        setIsOpen(true);
    }

    //Returns True If The Icon Should Be Shown
    var filter = (l_icon) =>
    {
        if (filterText == "") { return true; }

        if (l_icon.name.toLowerCase().includes(filterText.toLowerCase())) { return true; }
        if (JSON.stringify(l_icon.tags).toLowerCase().includes(filterText.toLowerCase())) { return true; } // No Point Iterating When This Is Simpler

        return false;
    }

    //Load More Icons When Scrolled To Bottom
    var checkEnd = (e) =>
    {
        if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1)
        {
            setLoadAmount(Math.min(loadAmount + 117, 5000)); //Tabler Only Has Around 5000 Icons So No Need To Load More
        }
    }

    var applyIcon = async (e) =>
    {
        var svgData = e.svg;
        var pngData = await GetIconAsPNG(svgData, 0, "transparent");
        props.metric.icon = pngData;
        setDataObject(Object.assign({}, DataObject));
        setIsOpen(false);
    }

    var iconsAvailable = [];
    if (window.tablerIconDatabase)
    {
        iconsAvailable = window.tablerIconDatabase;
    }

    return (
        <>
            <Button flat auto className="iconButtonLarge" onPress={openEditor}><i className="ti ti-color-swatch"></i></Button>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        <Input onChange={(e) => { setFilterText(e.target.value); setLoadAmount(127); }} width="850px" bordered placeholder="Search Icons From tabler-icons.io" />
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="iconSelect" onScroll={checkEnd}>
                        {
                            iconsAvailable.map((l_icon) =>
                            {
                                //We Don't Want A Lawsuit For Trademark Infringement
                                //Being Sued Is Very Unlikely But Better Safe Than Sorry
                                //If You Really Want Brand Icons Then Set localStorage.exp_enableBrandIcons to true
                                if (((!l_icon.name.startsWith("brand") && l_icon.category != "Brand") || localStorage.exp_enableBrandIcons == "true") && filter(l_icon) && currentlyLoaded < loadAmount)
                                {
                                    currentlyLoaded++;
                                    return (<Button key={l_icon.name} onPress={() => applyIcon(l_icon)} auto className="iconButtonLarge"><i className={`ti ti-${l_icon.name}`}></i></Button>);
                                }
                            })
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
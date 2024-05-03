var manageProjectsBackup = {};
var manageProjectsQueue = []

async function ApplyProjectChanges()
{
    StripInvalidDependencies();

    var iconQueue = await BuildIconQueue(CurrentProject(window.lastDataObject).metrics);
    manageProjectsQueue = iconQueue.concat(manageProjectsQueue);

    manageProjectsQueue.push({ "method": "PATCH", "action": "project_info", "body": JSON.stringify(window.lastDataObject["schema"], null, 2) })

    await ApplyQueue(manageProjectsQueue);

    manageProjectsQueue = [];
    
    //Close Project Manager
    await RefreshData();
    window.lastDataObject["page"] = null;
    window.setExtDataObject(Object.assign({}, window.lastDataObject));
}

function ManageProject()
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    //Load Metric Managers Async
    if (useFirstRender() && !window.ManageMetrics) {
        setTimeout(async () => {
            await LoadDependency("./JS/Management/metricmanager.jsx");
            await LoadDependency("./JS/Management/groupmanager.jsx");
            await LoadDependency("./JS/Management/snapshotmanager.jsx");
            setExtRedraw(UUID());
        }, 0)
    }

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
                        {
                            window.ManageMetrics ? 
                                (
                                    <>
                                        <MetricPreviewTrack index={0} />
                                        <MetricPreviewTrack index={1} />
                                        <MetricPreviewTrack index={2} />
                                    </>
                                ) : 
                                null
                            }
                        </div>
                        <ClientImage className="tooltipNoMetrics" src="./Images/TooltipNoMetrics.png" />

                        <div className="metricPreviewContent">
                            <div className="metricStatus onlyShowIfHasMetrics">
                                <h3 className="boldText">Metrics, Groups, & Snappers</h3>
                            </div>
                            <div className="metricPreviewButtons">
                                {
                                    window.ManageMetrics ? 
                                    (<ManageMetrics/>) : 
                                    <></>
                                }
                                {
                                    window.ManageGroups ? 
                                    (<ManageGroups/>) : 
                                    <></>
                                }                                
                                {
                                    window.ManageSnapshots ? 
                                    (<ManageSnapshots/>) : 
                                    <></>
                                }
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
                                <CachedIcon src={l_metric.icon}/>
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


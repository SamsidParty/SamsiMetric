//A Lot Of This Code Is Copied, Pasted, & Modified From groupmanager.jsx
//No Point Reinventing The Wheel

function CreateSnapper()
{
    var metric = Object.assign({}, SampleMetric());
    metric.type = "snapshot";
    metric.name = "New Snapper";
    manageProjectsQueue.push({ "method": "POST", "action": "metric_info", "type": metric["type"], "metric_id": metric["id"], "project_id": CurrentProject(window.lastDataObject)["id"] });
    CurrentProject(lastDataObject)["metrics"].push(metric);
    setExtDataObject(Object.assign({}, lastDataObject));
}

function ManageSnapshots(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);


    return (
        <>
            <Tooltip ttid="snapshotmanager" {...TTContent("static", "Capture Metrics Over Time")}>
                <Button className="manageSnapshotsButton onlyShowIfHasMetrics" flat auto onPress={() => { setIsOpen(true); }}><i className="ti ti-timeline"></i>&nbsp;&nbsp;Snappers</Button>
            </Tooltip>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Manage Snappers
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>
                    <div className="groupManager">
                        {
                            CurrentProject(DataObject).metrics.map((l_metric) => {
                                return l_metric.type == "snapshot" ? (
                                    <MetricSnapper {...props} key={l_metric.id} metric={l_metric} />
                                ) : (<React.Fragment key={l_metric.id} />);
                            })
                        }
                        <Button onPress={CreateSnapper} flat auto className="addMetricGroup iconButtonLarge"><i className="ti ti-plus"></i></Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );

}

function MetricSnapper(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div className="metricGroup" style={{ backgroundColor: `var(--nextui-colors-${props.metric.tag}Light)` }}>
            <div className="metricGroupHeader" style={{ backgroundColor: `var(--nextui-colors-${props.metric.tag}LightActive)` }}>
                <div className="metricGroupHeaderText">
                    <AutoTextSize maxFontSizePx={16} mode="oneline" style={{ color: `var(--nextui-colors-${props.metric.tag}LightContrast)` }}>{props.metric.name}</AutoTextSize>
                </div>
                <ManageMetricButton metric={props.metric}></ManageMetricButton>
                <DeleteButton color={props.metric.tag} onDelete={() => DeleteMetric(props.metric.id)}></DeleteButton>
            </div>
            <div className="metricGroupBody">
                {
                    props.metric.dependencies.map((l_dep) =>
                    {
                        var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);

                        if (dep.length != 0)
                        {
                            return (
                                <div style={{ backgroundColor: tagColors[dep.tag] }} className="metricIcon metricGroupIcon" key={l_dep}>
                                    <CachedIcon src={dep.icon}></CachedIcon>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    )
}
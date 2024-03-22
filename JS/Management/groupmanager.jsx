function CreateGroup()
{
    var metric = Object.assign({}, SampleMetric());
    metric.type = "group";
    metric.name = "New Group";
    manageProjectsQueue.push({ "method": "POST", "action": "metric_info", "type": metric["type"], "metric_id": metric["id"], "project_id": CurrentProject(window.lastDataObject)["id"] });
    CurrentProject(lastDataObject)["metrics"].push(metric);
    setExtDataObject(Object.assign({}, lastDataObject));
}

function ManageGroups(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Tooltip ttid="groupmanager" {...TTContent("static", "Group Metrics Together")}>
                <Button className="onlyShowIfHasMetrics" auto flat onPress={() => { setIsOpen(true); }}><i className="ti ti-package"></i>&nbsp;&nbsp;Groups</Button>
            </Tooltip>
            <Modal width="880px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Manage Groups
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="groupManager">
                        {
                            CurrentProject(DataObject).metrics.map((l_metric) =>
                            {
                                return l_metric.type == "group" ? (
                                    <MetricGroup {...props} key={l_metric.id} metric={l_metric} />
                                ) : (<React.Fragment key={l_metric.id} />);
                            })
                        }
                        <Button onPress={CreateGroup} flat auto className="addMetricGroup iconButtonLarge"><i className="ti ti-plus"></i></Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );

}

function MetricGroup(props)
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
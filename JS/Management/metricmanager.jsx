
RunOnLoad("./JS/Management/metricmanager.jsx", async () => {
    //Loads The Common Metric Editor Which Will Load All The Other Metric Editors
    await LoadDependency("./JS/Management/MetricEditors/common.jsx");
});

var SampleMetric = () =>
{
    return {
        "id": UUID(),
        "name": "New Metric",
        "tag": "primary",
        "type": "total",
        "icon": "default.png",
        "rounding": 2,
        "dependencies": []
    }
}

var MetricNames = {
    "total": "Total Number",
    "average": "Average Number",
    "country": "Numbers By Country"
}
var MetricTypeDetails = {
    "total": "The Sum Of Multiple Data Submissions",
    "average": "The Average Of Multiple Data Submissions",
    "country": "Total Numbers Arranged By Country"
}
var MetricTypes = Object.fromEntries(
    Object
        .entries(MetricNames)
        .map(([key, value]) => [value, key])
);

function ShouldShowMetric(metricType)
{
    if (metricType == "group") { return false; }
    return true;
}

function DeleteMetric(id)
{
    var metricIndex = ArrayIndex(CurrentProject(window.lastDataObject).metrics, "id", id);
    var metric = Object.assign({}, CurrentProject(window.lastDataObject).metrics[metricIndex]); // We Need To Access The Metric Info Later So Copy It

    CurrentProject(window.lastDataObject).metrics = CurrentProject(window.lastDataObject).metrics.filter((l_metric) =>
    {
        return l_metric.id != id;
    });

    manageProjectsQueue.push({ "method": "DELETE", "action": "metric_info", "type": metric["type"], "metric_id": metric["id"], "project_id": CurrentProject(window.lastDataObject)["id"] });

    setExtDataObject(Object.assign({}, window.lastDataObject));
}

function ManageMetrics()
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [Creator, setCreator] = React.useState(null);

    var createMetric = () =>
    {
        setCreator(<MetricCreator onClose={setCreator} ></MetricCreator>);
    }

    return (
        <>
            <Button className="manageMetricsButton" auto onPress={() => { setIsOpen(true); }}><i className="ti ti-ruler-2"></i>&nbsp;&nbsp;Edit Metrics</Button>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Manage Metrics
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>
                    <Table className="metricTable" css={{ width: "100%", height: "300px", padding: "0px" }} lined shadow={false}>
                        <Table.Header>
                            <Table.Column hideHeader={true}></Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {
                                CurrentProject(DataObject).metrics?.map((l_metric) =>
                                {
                                    return ShouldShowMetric(l_metric.type) ? (
                                        <Table.Row key={l_metric.id}>
                                            <Table.Cell>
                                                <div className="metricTableItem">
                                                    <div className="metricIcon" style={{ backgroundColor: tagColors[l_metric.tag] }}>
                                                        <CachedIcon src={l_metric.icon}></CachedIcon>
                                                    </div>
                                                    <h1>{l_metric.name}</h1>
                                                    <Tooltip ttid={"genrequest" + l_metric.id} {...TTContent("static", "Generate API Request")}>
                                                        <Button color={l_metric.tag} flat auto className="iconButton generateRequestButton"><i className="ti ti-code"></i></Button>
                                                    </Tooltip>
                                                    <ManageMetricButton key={l_metric.id} metric={l_metric}></ManageMetricButton>
                                                    <DeleteButton onDelete={() => DeleteMetric(l_metric.id)}></DeleteButton>
                                                </div>
                                            </Table.Cell>
                                        </Table.Row>
                                    ) : null;
                                })
                            }
                        </Table.Body>
                        <Table.Pagination noMargin align="center" rowsPerPage={Math.min(6, CurrentProject(DataObject).metrics?.length)} />
                    </Table>

                    <Button flat auto className="iconButtonLarge" onPress={createMetric} css={{ marginLeft: "auto" }}><i className="ti ti-plus"></i></Button>
                </Modal.Body>
            </Modal>

            {Creator}
        </>
    );

}

function ManageMetricButton(props)
{

    var [isOpen, setIsOpen] = React.useState(false);

    var openEditor = () =>
    {
        setIsOpen(true);
    }

    return (
        <>
            <Tooltip ttid={"managemetric" + props.metric.id} {...TTContent("static", "Manage Metric")}>
                <Button css={props.css} flat color={props.metric.tag} auto onPress={openEditor} className="iconButtonLarge manageMetricButton"><i className="ti ti-edit"></i></Button>
            </Tooltip>
            <Modal closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        {
                            props.metric.type == "group" ?
                            "Edit Group" :
                            "Edit Metric"
                        }
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {
                        eval("MetricEdit_" + props.metric["type"] + "(props)")
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}

function MetricCreator(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var [metric, setMetric] = React.useState(SampleMetric());

    var editValue = (e, k) =>
    {
        metric[k] = e.target.value;
        setMetric(Object.assign({}, metric));
    }

    var commit = () =>
    {
        manageProjectsQueue.push({ "method": "POST", "action": "metric_info", "type": metric["type"], "metric_id": metric["id"], "project_id": CurrentProject(window.lastDataObject)["id"] });
        CurrentProject(DataObject)["metrics"].push(metric);
        setDataObject(Object.assign({}, DataObject));
        props.onClose();
    }

    return (
        <Modal closeButton open={true} onClose={props.onClose}>
            <Modal.Header>
                <Text b id="modal-title" size={20}>
                    Create Metric
                </Text>
            </Modal.Header>
            <Modal.Body>
                <Input bordered placeholder="Metric Name" label="Metric Name" onChange={(e) => { editValue(e, "name") }} initialValue={metric["name"]} />
                <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">Metric Type</p>
                <Dropdown>
                    <Dropdown.Button flat color="secondary">
                        {MetricNames[metric["type"]]}
                    </Dropdown.Button>
                    <Dropdown.Menu css={{ $$dropdownMenuWidth: "340px" }} onAction={(e) => { editValue({ "target": { "value": e } }, "type") }}>
                        {
                            Object.entries(MetricTypes).map((e) =>
                            {
                                return (
                                    <Dropdown.Item description={MetricTypeDetails[e[1]]} key={e[1]} >{e[0]}</Dropdown.Item>
                                );
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </Modal.Body>
            <Modal.Footer>
                <Button auto onPress={commit}>Create</Button>
            </Modal.Footer>
        </Modal>
    )
}

function MetricDataChanged_input(event)
{

    var dataKey = event.target.getAttribute("data-key");
    var metricID = dataKey.split("/")[0];
    var metricProperty = dataKey.split("/")[1];

    var DataObject = extDataObject;
    var metric = ArrayValue(CurrentProject(DataObject).metrics, "id", metricID);
    metric[metricProperty] = event.target.value;
    setExtDataObject(Object.assign({}, DataObject));
}


function ColorBar(props)
{

    var [value, setValue] = React.useState(props.value);

    var textContent = (e) =>
    {

        if (value == e)
        {
            return (<i className="ti ti-point-filled"></i>);
        }

        return (<i className="ti ti-point"></i>);
    }

    var changeClicked = (e) =>
    {
        setValue(e.target.name);
        e.target.value = e.target.name;
        e.target.setAttribute("data-key", props["data-key"]);

        if (props.onChange)
        {
            props.onChange(e);
        }

    }

    return (
        <div value={value}>
            <div className="horizontalButtons">
                <Button onPress={changeClicked} auto name="success" color="success">{textContent("success")}</Button>
                <Button onPress={changeClicked} auto name="primary" color="primary">{textContent("primary")}</Button>
                <Button onPress={changeClicked} auto name="secondary" color="secondary">{textContent("secondary")}</Button>
                <Button onPress={changeClicked} auto name="warning" color="warning">{textContent("warning")}</Button>
                <Button onPress={changeClicked} auto name="error" color="error">{textContent("error")}</Button>
            </div>
        </div>
    )
}
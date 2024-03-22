var SnappableMetrics = [
    "total",
    "average",
    "group",
    "country"
]

function MetricEdit_snapshot(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [selected, setSelected] = React.useState(props.metric.dependencies);

    var addSubmetric = (e) =>
    {
        if (props.metric.dependencies.includes(e))
        {
            props.metric.dependencies = props.metric.dependencies.filter(l_dependency => l_dependency !== e); //Remove Dependency
        }
        else
        {
            props.metric.dependencies.push(e); // Add Dependency
        }

        StripInvalidDependencies(props.metric);

        setSelected(Object.assign([], props.metric.dependencies));
        setExtDataObject(Object.assign({}, DataObject));
    }

    var selectRounding = (e) => {
        props.metric.rounding = e.currentKey;
        setExtDataObject(Object.assign({}, DataObject));
    }

    var snapshotFrequencies = [
        "Every Minute",
        "Every 10 Minutes",
        "Every Hour",
        "Every Day"
    ]

    return (
        <>
            <MetricEdit_common metric={props.metric} exampleName="eg: Operating System" ></MetricEdit_common>
            <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">SNAPSHOT FREQUENCY</p>

            <Dropdown>
                <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
                    {snapshotFrequencies[props.metric.rounding]}
                </Dropdown.Button>
                <Dropdown.Menu
                    selectionMode="single"
                    onSelectionChange={selectRounding}
                >
                    <Dropdown.Item key={0}>Every Minute</Dropdown.Item>
                    <Dropdown.Item key={1}>Every 10 Minutes</Dropdown.Item>
                    <Dropdown.Item key={2}>Every Hour</Dropdown.Item>
                    <Dropdown.Item key={3}>Every Day</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">SNAPSHOT TARGETS</p>
            <Dropdown>
                <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
                    {selected.length} Submetrics Added
                </Dropdown.Button>
                <Dropdown.Menu
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selected}
                    onAction={addSubmetric}
                >
                    {
                        //Add Snappable Metrics To Dropdown
                        CurrentProject(DataObject).metrics.map((l_metric) =>
                        {
                            if (SnappableMetrics.includes(l_metric.type))
                            {
                                return (<Dropdown.Item key={l_metric.id}>{l_metric.name}</Dropdown.Item>);
                            }
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
            <NextUI.Spacer y={1} />
        </>
    )
}
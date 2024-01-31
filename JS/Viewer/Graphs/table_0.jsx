function Graphtable_0(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);
    var chartFill = FillChart(metric, window.lastDataObject, { rawColor: true });

    //If The Graph Is Country, Compare Country Values, Otherwise Compare Values Of Group Members
    var multiCountryMode = metric.type == "group" &&
        !metric.dependencies.map((l_dep) =>
        {
            return (ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep).type == "country").toString();
        }).includes("false"); // If At Least One Of The Dependencies Is Not A Country Then False
    var countryMode = metric.type == "country" || multiCountryMode;

    var values = chartFill[0];
    var names = chartFill[1];
    var colors = chartFill[2];
    var percents = chartFill[4];

    return (
        <div style={props.style} className={"layoutCard graphTable0 " + props.cardSize}>
            <GraphCommon {...props} />
            <Table className="table">
                <Table.Header>
                    <Table.Column style={{ width: "30px" }}>
                        <div className="metricIcon" style={{ backgroundColor: tagColors[metric.tag] }}>
                            <CachedIcon src={metric.icon} />
                        </div>
                    </Table.Column>
                    <Table.Column>{countryMode ? "COUNTRY" : "METRIC"}</Table.Column>
                    {
                        (() =>
                        {
                                var columns = [];
                                if (false && multiCountryMode) // Not Implemented Yet
                                {
                                    return metric.dependencies.map((l_dep) =>
                                    {
                                        var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);
                                        return (<Table.Column key={l_dep}>{dep.name.toUpperCase()}</Table.Column>);
                                    });
                                }
                                else if (countryMode)
                                {
                                    columns.push(<Table.Column key={UUID()}>{metric.unit?.toUpperCase()}</Table.Column>);
                                    columns.push(<Table.Column key={UUID()}>% OF {metric.unit?.toUpperCase()}</Table.Column>);
                                }
                                else
                                {
                                    columns.push(<Table.Column key={UUID()}>VALUE</Table.Column>);
                                    columns.push(<Table.Column key={UUID()}>% OF VALUE</Table.Column>);
                                }
                                return columns;
                        })()
                    }
                </Table.Header>
                <Table.Body>
                    {
                        names.map((l_name, l_index) =>
                        {
                            return (
                                <Table.Row key={l_index}>
                                    <Table.Cell>
                                        <div className="metricIcon" style={{ backgroundColor: colors[l_index] }}>
                                            <CachedIcon src={metric.icon} />
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>{l_name}</Table.Cell>
                                    <Table.Cell>{values[l_index]}</Table.Cell>
                                    <Table.Cell>{percents[l_index]}%</Table.Cell>
                                </Table.Row>
                            )
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    )
}
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

    //Return Empty Graph Until Country List Is Available
    if (countryMode && !window.listOfCountries) {
        return (
            <div style={props.style} className={"layoutCard graphTable0 " + props.cardSize}>
                <GraphCommon {...props} />
            </div>
        )
    }

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
                                        columns.push(<Table.Column key={UUID()}>{dep.name.toUpperCase()}</Table.Column>);
                                    });
                                }
                                else if (countryMode)
                                {
                                    columns.push(<Table.Column key={UUID()}>{(metric.unit || "VALUE").toUpperCase()}</Table.Column>);
                                    columns.push(<Table.Column key={UUID()}>% OF {(metric.unit || "VALUE").toUpperCase()}</Table.Column>);
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
                    (() =>
                        {
                                if (false && multiCountryMode) // Not Implemented Yet
                                {
                                    return metric.dependencies.map((l_dep) =>
                                    {
                                        var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);
                                        columns.push(<Table.Column key={UUID()}>{dep.name.toUpperCase()}</Table.Column>);
                                    });
                                }
                                else if (countryMode)
                                {
                                    return window.listOfCountries.map((l_country, l_index) =>
                                    {
                                        var name = l_country.name;
                                        var row = ArrayValue(DataObject.data.data_country, "MetricID", metric.id);
                                        var value = row["Country" + l_country.alpha2.toUpperCase()];
                                        var valuePercent = ConvertPercents(row, (l_key) => l_key.includes("Country"))["Country" + l_country.alpha2.toUpperCase()];

                                        return [(
                                            <Table.Row key={l_index}>
                                                <Table.Cell>
                                                    <Flag code={l_country.alpha2} size="L" hasBorder={true} ></Flag>   
                                                </Table.Cell>
                                                <Table.Cell>{name}</Table.Cell>
                                                <Table.Cell>{value.toString()}</Table.Cell>
                                                <Table.Cell>{valuePercent.toString()}%</Table.Cell>
                                            </Table.Row>
                                        ), value]
                                    })
                                }
                                else
                                {
                                    return names.map((l_name, l_index) =>
                                    {
                                        return [(
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
                                        ), values[l_index]]
                                    })
                                }
                        })().sort((a, b) => b[1] - a[1]).map((l_row) => l_row[0])
                    }
                </Table.Body>
            </Table>
        </div>
    )
}
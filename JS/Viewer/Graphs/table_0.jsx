Array.prototype.Graphtable_0_sorting = function(setting) {

    if (setting == 0) {
        return this;
    }

    return this.sort((a, b) => { 
        //Sort Array
        if (setting == 1) { // Value - High To Low
            return b[1] - a[1];
        }
        else if (setting == 2) { // Value - Low To High
            return a[1] - b[1];
        }
        else if (setting == 3) { // Alphabetical - A To Z
            return a[2] < b[2] ? -1 : 1;
        }
        else { // Value - Alphabetical - Z To A
            return a[2] > b[2] ? -1 : 1;
        }
    });
}

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
                                if (multiCountryMode)
                                {
                                    metric.dependencies.map((l_dep, l_index) =>
                                    {
                                        var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);
                                        columns.push(<Table.Column key={l_index}>{dep.name.toUpperCase()}</Table.Column>);
                                    });
                                }
                                else if (countryMode)
                                {
                                    columns.push(<Table.Column key={0}>{(metric.unit || "VALUE").toUpperCase()}</Table.Column>);
                                    columns.push(<Table.Column key={1}>% OF {(metric.unit || "VALUE").toUpperCase()}</Table.Column>);
                                }
                                else
                                {
                                    columns.push(<Table.Column key={0}>VALUE</Table.Column>);
                                    columns.push(<Table.Column key={1}>% OF VALUE</Table.Column>);
                                }
                                return columns;
                        })()
                    }
                </Table.Header>
                <Table.Body>
                {
                    (() =>
                        {
                                if (multiCountryMode)
                                {
                                    return window.listOfCountries.map((l_country, l_index) =>
                                    {
                                        var name = l_country.name;
                                        var totalValue = 0;

                                        return [(
                                            <Table.Row key={l_index}>
                                                <Table.Cell>
                                                    <Flag code={l_country.alpha2} size="L" hasBorder={true} ></Flag>   
                                                </Table.Cell>
                                                <Table.Cell>{name}</Table.Cell>
                                                {
                                                    (() =>
                                                    {
                                                        var columns = [];
                                                        metric.dependencies.map((l_dep, l_index) =>
                                                        {
                                                            var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);
                                                            var row = ArrayValue(DataObject.data.data_country, "MetricID", l_dep);
                                                            var value = row["Country" + l_country.alpha2.toUpperCase()];
                                                            totalValue += value;
                                                            columns.push(<Table.Cell key={l_index}>{value}</Table.Cell>);
                                                        })
                                                        return columns;
                                                    })()
                                                }
                                            </Table.Row>
                                        ), totalValue, name]
                                    })
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
                                        ), value, name]
                                    });
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
                                        ), values[l_index], l_name]
                                    });
                                }
                        })().Graphtable_0_sorting(props.graph.sorting).map((l_row) => { 
                            //Hide Rows With A Value Of Zero If hidenullrows Is True
                            return props.graph.hidenullrows ? (l_row[1] == 0 ? null : l_row[0]) : l_row[0];
                        })
                    }
                </Table.Body>
            </Table>
        </div>
    )
}

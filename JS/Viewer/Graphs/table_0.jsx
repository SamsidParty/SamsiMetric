function Graphtable_0(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);
    var chartFill = FillChart(metric, window.lastDataObject);

    //If The Graph Is Country, Compare Country Values, Otherwise Compare Values Of Group Members
    var countryMode = metric.type == "country";

    var values = chartFill[0];
    var names = chartFill[1];
    var colors = chartFill[2];
    var percents = chartFill[4];

    return (
        /*                             ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ NextUI Doesn't Allow Us To Change The Header Color From JS, So Do It In CSS  */
        <div style={{ ...props.style, "--col-tablehead": tagColors[metric.tag] }} className={"layoutCard graphTable0 " + props.cardSize}>
            <GraphCommon {...props} />
            <Table className="table">
                <Table.Header>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>VALUE</Table.Column>
                    <Table.Column>% OF VALUE</Table.Column>
                </Table.Header>
                <Table.Body>
                    {
                        names.map((l_name, l_index) =>
                        {
                            return (
                                <Table.Row key={l_index}>
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
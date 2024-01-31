function Graphtable_0(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var displayValue = ValueFromNumberMetric(metric, DataObject).toLocaleString("en-US");

    return (
        /*                            ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ NextUI Doesn't Allow Us To Change The Header Color From JS, So Do It In CSS  */
        <div style={{...props.style, "--col-tablehead": tagColors[metric.tag] }} className={"layoutCard graphTable0 " + props.cardSize}>
            <GraphCommon {...props} />
            <Table className="table">
                <Table.Header>
                    <Table.Column>NAME</Table.Column>
                    <Table.Column>ROLE</Table.Column>
                    <Table.Column>STATUS</Table.Column>
                </Table.Header>
                <Table.Body>
                    <Table.Row key="1">
                        <Table.Cell>Tony Reichert</Table.Cell>
                        <Table.Cell>CEO</Table.Cell>
                        <Table.Cell>Active</Table.Cell>
                    </Table.Row>
                    <Table.Row key="2">
                        <Table.Cell>Zoey Lang</Table.Cell>
                        <Table.Cell>Technical Lead</Table.Cell>
                        <Table.Cell>Paused</Table.Cell>
                    </Table.Row>
                    <Table.Row key="3">
                        <Table.Cell>Jane Fisher</Table.Cell>
                        <Table.Cell>Senior Developer</Table.Cell>
                        <Table.Cell>Active</Table.Cell>
                    </Table.Row>
                    <Table.Row key="4">
                        <Table.Cell>William Howard</Table.Cell>
                        <Table.Cell>Community Manager</Table.Cell>
                        <Table.Cell>Vacation</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </div>
    )
}
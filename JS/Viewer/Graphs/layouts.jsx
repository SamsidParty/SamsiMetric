function layout_1(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout1">
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
        </div>
    )
}

function layout_2(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout2">
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
        </div>
    )
}

function layout_3(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout3">
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
        </div>
    )
}
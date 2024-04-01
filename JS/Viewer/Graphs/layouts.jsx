function LayoutCommon(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var deleteLayout = async () => {
        CurrentWorkspace(DataObject).layouts.splice(props.layoutIndex, 1);
        setDataObject(Object.assign({}, DataObject));
        await SyncWorkspaceChanges(DataObject);
        await RefreshData();
    }

    return (
        <>
            {
                (window.workspaceEditMode && !props.preview) ? 
                (
                    <Tooltip ttid={"deletelayout_" + UUID()} {...TTContent("static", "Delete Layout")}>
                        <DeleteButton noRevert={true} onDelete={deleteLayout}></DeleteButton>
                    </Tooltip>
                )
                : (<></>)
            }
        </>
    )
}

function Layout_1(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout1">
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
            <MetricGraph cardSize="csMedLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
            <LayoutCommon {...props} />
        </div>
    )
}

function Layout_2(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout2">
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
            <MetricGraph cardSize="csShortLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
            <LayoutCommon {...props} />
        </div>
    )
}

function Layout_3(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout3">
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
            <LayoutCommon {...props} />
        </div>
    )
}


function Layout_4(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout3">
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <div className="flexy gap20">
                <div className="flexx gap20">
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
                </div>
                <div className="flexx gap20">
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={4} graph={props.layout?.graphs?.[4]} />
                </div>
            </div>
            <LayoutCommon {...props} />
        </div>
    )
}

function Layout_5(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout layout3">
            <div className="flexy gap20">
                <div className="flexx gap20">
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={props.layout?.graphs?.[1]} />
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={2} graph={props.layout?.graphs?.[2]} />
                </div>
                <div className="flexx gap20">
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={3} graph={props.layout?.graphs?.[3]} />
                    <MetricGraph cardSize="csMedLong" {...props} graphIndex={4} graph={props.layout?.graphs?.[4]} />
                </div>
            </div>
            <MetricGraph cardSize="csLongDouble" {...props} graphIndex={0} graph={props.layout?.graphs?.[0]} />
            <LayoutCommon {...props} />
        </div>
    )
}
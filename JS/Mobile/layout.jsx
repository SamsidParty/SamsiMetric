//Show All Graphs In A Vertical Format, For Use On Mobile
function MobileLayout(props) {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout mobileLayout">
            {
                props.layout?.graphs.map((l_graph, l_index) => { // Ignore Empty Graphs
                    if (Object.keys(l_graph).length > 0) {
                        return (<MetricGraph cardSize={GetMetadataFromLayout(props.layout).graphorder[l_index]} {...props} graphIndex={0} graph={l_graph} />)
                    }
                })
            }
            <LayoutCommon {...props} />
        </div>
    )
}
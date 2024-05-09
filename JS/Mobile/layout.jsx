RunOnLoad("./JS/Mobile/layout.jsx", async () => LoadDependency("./JS/ThirdParty/reactmoderndrawer.js"));

//Show All Graphs In A Vertical Format, For Use On Mobile
function MobileLayout(props) {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <div style={props.style || {}} className="workspaceLayout mobileLayout">
            {
                props.layout?.graphs.map((l_graph, l_index) => { // Ignore Empty Graphs
                    if (Object.keys(l_graph).length > 0) {
                        return (<MetricGraph key={l_index} cardSize={GetMetadataFromLayout(props.layout).graphorder[l_index]} {...props} graphIndex={l_index} graph={l_graph} />)
                    }
                })
            }
            <LayoutCommon {...props} />
        </div>
    )
}

function MobileWorkspaceHeader(props) {
    return (
        <h2 className="mobileWorkspaceHeader">{props.workspace?.name || localStorage.lastWorkspaceName || ""}</h2>
    );
}
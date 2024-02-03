AutoLoadThisFile();


RunOnLoad("./JS/Viewer/Graphs/common.jsx", async () =>
{
    await LoadDependency("./JS/Viewer/Graphs/layouts.jsx");
    await LoadDependency("./JS/Viewer/Graphs/metadata.js");

    //Load All Graphs
    for (let i = 0; i < GraphTypes.length; i++)
    {
        await LoadDependency(`./JS/Viewer/Graphs/${GraphTypes[i].name}.jsx`);
    }
});

function DummyGraph(props)
{

    return (
        <div className={"flexx facenter fjcenter layoutCard " + props.cardSize}>
            {
                (window.workspaceEditMode) ?
                    <>
                        <GraphSelect {...props}></GraphSelect>
                    </>
                    : <></>
            }

        </div>
    );
}

function GraphCommon(props)
{

    var [isOpen, setIsOpen] = React.useState(false);

    var removeGraph = async () =>
    {
        props.layout.graphs[props.graphIndex] = {};
        await SyncWorkspaceChanges();
        await RefreshData();
    }

    return (
        <>
            {
                window.workspaceEditMode && !props.isPreview ?
                    <div className="cardActionRow" style={{ backgroundColor: `var(--nextui-colors-${props.workspace.tag}Light)` }}>
                        <Button className="iconButton" color={props.workspace.tag} onPress={() => setIsOpen(true)} flat auto><i className="ti ti-pencil"></i></Button>
                        <Button className="iconButton" color={props.workspace.tag} onPress={removeGraph} flat auto><i className="ti ti-trash"></i></Button>
                    </div> :
                    <></>
            }
            {
                (localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") && !props.isPreview && isDesktop ?
                    <GraphEditor isOpen={isOpen} setIsOpen={setIsOpen} {...props} /> :
                    <></>
            }
        </>
    )
}

//Some Graphs Need Dependencies Like React Simple Maps
//Collect The Needed Dependencies And Load Them
async function LoadGraphDependencies(workspace)
{

    //Make Sure Workspace Is Valid And That We Actually Need To Load Dependencies
    if (!workspace) { return; }
    if (!window.fullfilledDependenciesFor) { window.fullfilledDependenciesFor = []; }
    if (window.fullfilledDependenciesFor[workspace.id] == true) { return; }

    var neededDependencies = [];

    //Find Needed Dependencies
    for (let i = 0; i < workspace.layouts.length; i++)
    {
        for (let j = 0; j < workspace.layouts[i].graphs.length; j++)
        {
            var graph = GetMetadataFromGraph(workspace.layouts[i].graphs[j]);
            if (!graph.dependencies) { continue; }
            for (let k = 0; k < graph.dependencies.length; k++)
            {
                if (!neededDependencies.includes(graph.dependencies[k]))
                {
                    neededDependencies.push(graph.dependencies[k]);
                }
            }
        }
    }

    //Load The Dependency
    for (let i = 0; i < neededDependencies.length; i++)
    {
        await LoadDependency(neededDependencies[i]);
    }

    window.fullfilledDependenciesFor[workspace.id] = true;
    setTimeout(() => setExtRedraw(UUID()), 0);
}

function MetricGraph(props)
{
    var nonce = `N_Graph_${props.graphIndex}_Layout_${props.layoutIndex}_Workspace_${props.workspace.id}`; // Used To Identify Graph Across Rerenders

    if (props.graph == undefined || Object.keys(props.graph).length == 0)
    {
        return DummyGraph(props);
    }
    else
    {
        var GraphToRender = ArrayValue(GraphTypes, "name", props.graph["type"]).render();
        return (
            <MetricErrorBoundary key={nonce} graphNonce={nonce} style={ScaleGraph(props.cardSize)} {...props}>
                <GraphToRender graphNonce={nonce} style={ScaleGraph(props.cardSize)} {...props} />
            </MetricErrorBoundary>
        )
    }
}

//Scale The Graph On Mobile
//Takes In The Graph Type And Returns A Style Object
//Set raw To True To Obtain The Value Directly
function ScaleGraph(type, raw)
{
    if (!window.isMobile)
    {

        if (raw)
        {
            return 1;
        }

        return {};
    }

    var graphWidth = GraphWidths[type] || 120;
    var scale = window.innerWidth / (graphWidth * (1 / 0.9)); // Make The Graph Take Up 90% Of The Screen Width

    if (raw)
    {
        return scale;
    }

    return {
        "--card-scale": scale,
        width: graphWidth * scale,
        height: GraphHeights[type] * scale,
    };
}
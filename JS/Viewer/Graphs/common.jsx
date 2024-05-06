AutoLoadThisFile();


RunOnLoad("./JS/Viewer/Graphs/common.jsx", async () =>
{
    await LoadDependency("./JS/Viewer/snapshot.jsx");
    await LoadDependency("./JS/Viewer/Graphs/layouts.jsx");
    await LoadDependency("./JS/Viewer/Graphs/metadata.js");

    //Load All Graphs
    for (let i = 0; i < GraphTypes.length; i++)
    {
        if (GraphTypes[i].native) {
            await LoadDependency(`./JS/Viewer/Graphs/${GraphTypes[i].name}.jsx`);
        }
    }
});

function DummyGraph(props)
{

    return (
        <div className={"flexx facenter fjcenter layoutCard " + props.cardSize}>
            {
                (window.workspaceEditMode && !props.preview) ?
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

function GraphLoading(props) {

    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    return (
        <div className="graphLoading">
            <LoadingWheel/>
        </div>
    )
}

function GraphLoadingOverlay(props) {

    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    return (
        <div className="graphLoadingOverlay" style={{ display: !!props.hide ? "none" : "flex" }}>
            <LoadingWheel/>
        </div>
    )
}

//Some Graphs Need Dependencies Like Chart.JS
//Collect The Needed Dependencies And Load Them
//graphs Can Be An Array Of Graph Metadata Or A Workspace Object
async function LoadGraphDependencies(graphs)
{

    //Make Sure Workspace Is Valid And That We Actually Need To Load Dependencies
    if (!graphs) { return; }
    if (!window.fullfilledDependenciesFor) { window.fullfilledDependenciesFor = []; }
    if (window.fullfilledDependenciesFor[graphs.id] == true) { return; }

    var graphsMode = "graphs";
    if (!!graphs.id) {
        //graphs Is A Workspace Object
        graphsMode = "workspace";
    }

    var neededDependencies = [];

    var addToDependencyChain = (graph) => {
        if (!graph.dependencies) { return; }
        for (let k = 0; k < graph.dependencies.length; k++)
        {
            if (!neededDependencies.includes(graph.dependencies[k]))
            {
                neededDependencies.push(graph.dependencies[k]);
            }
        }
    }

    //Find Needed Dependencies
    if (graphsMode == "graphs") {
        graphs.forEach(addToDependencyChain)
    }
    else {
        for (let i = 0; i < graphs.layouts.length; i++)
        {
            for (let j = 0; j < graphs.layouts[i].graphs.length; j++)
            {
                addToDependencyChain(GetMetadataFromGraph(graphs.layouts[i].graphs[j]));
            }
        }
    }


    //Load The Dependency
    for (let i = 0; i < neededDependencies.length; i++)
    {
        await LoadDependency(neededDependencies[i]);
    }

    if (graphsMode == "workspace") { 
        window.fullfilledDependenciesFor[graphs.id] = true;
    }

    setTimeout(() => setExtRedraw(UUID()), 0);
}

function MetricGraph(props)
{
    if (props.graph == undefined || Object.keys(props.graph).length == 0)
    {
        return DummyGraph(props);
    }

    var nonce = `N_Graph_${props.graphIndex}_Layout_${props.layoutIndex}_Workspace_${props.workspace.id}`; // Used To Identify Graph Across Rerenders
    var GraphToRender = ArrayValue(GraphTypes, "name", props.graph["type"])?.render;

    if (!GraphToRender) {
        return (
            <div style={ScaleGraph(props.cardSize)} className={"layoutCard graphError0 " + props.cardSize}>
                <GraphCommon {...props} />
                <i className="ti ti-question-mark"></i>
            </div>
        );
    }

    GraphToRender = GraphToRender();
    return (
        <MetricErrorBoundary key={nonce} graphNonce={nonce} style={ScaleGraph(props.cardSize)} {...props}>
            <GraphToRender graphNonce={nonce} style={ScaleGraph(props.cardSize)} {...props} />
        </MetricErrorBoundary>
    )
    
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
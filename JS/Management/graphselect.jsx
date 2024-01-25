function GraphSelect(props) {
    
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [p1IsOpen, setp1IsOpen] = React.useState(false);
    var [p2IsOpen, setp2IsOpen] = React.useState(false);
    var [selectedMetric, setSelectedMetric] = React.useState({});

    //Page 1 - User Selects Metric
    //Page 2 - User Selects Graph

    var openPage2 = (metric) => {
        setp1IsOpen(false);
        setp2IsOpen(true);
        setSelectedMetric(metric);
    }

    var applyGraph = async (settings) => {
        props.layout.graphs[props.graphIndex] = Object.assign({}, settings);
        await SyncWorkspaceChanges(DataObject);
        setp1IsOpen(false);
        setp2IsOpen(false);
        await RefreshData();
    }

    return (
        <>
            <Button flat auto rounded className="iconButtonLarge" color={props.workspace.tag} onPress={() => setp1IsOpen(true)}><i className="ti ti-plus"></i></Button>
            <Modal width="850px" closeButton open={p1IsOpen} onClose={() => setp1IsOpen(false)}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Select Metric
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="metricSelect">
                        {
                            CurrentProject(DataObject).metrics.length > 0 ?
                            CurrentProject(DataObject).metrics.map((l_metric) => {
                                return (<Button onPress={() => openPage2(l_metric)} auto key={l_metric.id} color={l_metric.tag}><CachedIcon width="25px" src={l_metric.icon}></CachedIcon> &nbsp; {l_metric.name}</Button>);
                            }) :
                            "No Metrics Available"
                        }
                    </div>
                </Modal.Body>
            </Modal>
            <Modal width="900px" closeButton open={p2IsOpen} onClose={() => setp2IsOpen(false)}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Graphs For "{selectedMetric?.name}"
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="graphSelect">
                        {
                            GetGraphsFor(selectedMetric, props.cardSize).length > 0 ?
                            GetGraphsFor(selectedMetric, props.cardSize).map((l_graph) => {
                                var GraphSettings = l_graph.settingsui;
                                return (<GraphSettings onApply={applyGraph} key={l_graph.name} {...props} isPreview={true} graphmeta={l_graph} graph={{ type: l_graph.name, for: selectedMetric?.id }} />);
                            }) :
                            "No Graphs Available"
                        }
                    </div>
                    <NextUI.Spacer y={0} />
                </Modal.Body>
            </Modal>
        </>
    )
}

function GetGraphsFor(metric, size) {

    var validGraphs = [];

    if (!metric) { return validGraphs; }

    GraphTypes.forEach((l_graph) => {
        if (l_graph.for.includes(metric.type) && l_graph.size.includes(size)) {
            validGraphs.push(l_graph);
        }
    });

    return validGraphs;
}
function GraphEditor(props)
{

    var graphMeta = ArrayValue(window.GraphTypes, "name", props.graph.type);
    var GraphSettings = graphMeta.settingsui;

    if (!GraphSettings) {
        return null
    }

    var apply = async (settings) =>
    {
        props.layout.graphs[props.graphIndex] = Object.assign({}, settings);

        await SyncWorkspaceChanges();
        await RefreshData();
    }

    return (
        <Modal width="1200px" closeButton open={props.isOpen} onClose={() => props.setIsOpen(false)}>
            <Modal.Header>
                <Text b id="modal-title" size={20}>
                    Edit Graph Settings
                </Text>
            </Modal.Header>
            <Modal.Body>
                <div className="graphSelect" style={{ minHeight: "0" }}>
                    <GraphSettings key={UUID()} onApply={apply} {...props} isPreview={true} graphmeta={graphMeta} graph={props.graph} />
                </div>
                <NextUI.Spacer y={0} />
            </Modal.Body>
        </Modal>
    )
}

function graphsettings_standard(props)
{
    var [settings, setSettings] = React.useState(Object.assign({}, props.graph));

    var apply = () =>
    {
        props.onApply(settings);
    }

    //Load Graph Dependencies
    props.graphmeta.dependencies?.forEach(async (l_dep) => {
        if (!window.loadedDependencies.includes(l_dep)){
            await LoadDependency(l_dep);
            setSettings(Object.assign({}, settings));
        }
    });  

    var setSetting = (setting, value) =>
    {
        settings[setting.name] = value;
        setSettings(Object.assign({}, settings));
    }

    return (
        <div className="graphSettings" key={settings.for}>
            <MetricGraph key={settings.for} {...props} graph={settings}></MetricGraph>
            <div className={"graphSettingsBox graphSettings" + props.cardSize}>
                {<SettingRenderer settings={props.graphmeta.settings} settingTarget={settings} setSetting={setSetting} />}
                <Button flat auto css={{ marginLeft: "auto" }} className="applyGraphSettings" onPress={apply}>Apply</Button>
            </div>
        </div>
    )
}
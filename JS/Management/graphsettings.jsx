function GraphEditor(props)
{

    var graphMeta = ArrayValue(window.GraphTypes, "name", props.graph.type);
    var GraphSettings = graphMeta.settingsui;

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
                    <GraphSettings onApply={apply} {...props} isPreview={true} graphmeta={graphMeta} graph={props.graph} />
                </div>
                <NextUI.Spacer y={0} />
            </Modal.Body>
        </Modal>
    )
}

function graphsettings_standard(props)
{

    var [settings, setSettings] = React.useState(
        {
            "for": props.graph.for,
            "type": props.graph.type
        }
    );

    var apply = () =>
    {
        props.onApply(settings);
    }

    var GraphSettingsCommon = graphsettings_common;

    props.graphmeta.dependencies?.forEach(async (l_dep) => {
        if (!window.loadedDependencies.includes(l_dep)){
            await LoadDependency(l_dep);
            setSettings(Object.assign({}, settings));
        }
    });  


    return (
        <div className="graphSettings" key={settings.for}>
            <MetricGraph key={settings.for} {...props} graph={settings}></MetricGraph>
            <div className={"graphSettingsBox graphSettings" + props.cardSize}>
                {<GraphSettingsCommon {...props} settings={settings} setSettings={setSettings} />}
                <Button flat auto css={{ marginLeft: "auto" }} className="applyGraphSettings" onPress={apply}>Apply</Button>
            </div>
        </div>
    )
}

function graphsettings_common(props)
{

    var setSetting = (setting, value) =>
    {
        props.settings[setting.name] = value;
        props.setSettings(Object.assign({}, props.settings));
    }

    var renderSetting = (setting) =>
    {

        if (useFirstRender())
        {
            setTimeout(() =>
            {
                setSetting(setting, props.graph[setting.name] || setting.default);
            }, 0);
        }

        if (setting.type == "bool")
        {
            return renderSetting_bool(setting);
        }
        else if (setting.type == "select")
        {
            return renderSetting_select(setting);
        }
    }

    var renderSetting_bool = (setting) =>
    {
        return (
            <div className="graphSetting" key={setting.name}>
                <h3 style={{ margin: "0" }} className="boldText">{setting.displayname}</h3>
                <Switch checked={(props.graph[setting.name] != undefined) ? props.graph[setting.name] : setting.default} onChange={(e) => { setSetting(setting, e.target.checked); }} />
            </div>
        )
    }

    var renderSetting_select = (setting) =>
    {
        var setSelected = (s) => {
            setSetting(setting, parseInt(s.currentKey));
        }

        return (
            <div className="graphSetting" key={setting.name}>
                <h3 style={{ margin: "0" }} className="boldText">{setting.displayname}</h3>
                <Dropdown>
                    <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
                        {(props.settings[setting.name] != undefined) ? setting.options[props.settings[setting.name]] : setting.options[setting.default]}
                    </Dropdown.Button>
                    <Dropdown.Menu
                        selectionMode="single"
                        selectedKeys={[]}
                        onSelectionChange={setSelected}
                    >
                        {
                            setting.options.map((l_option, l_index) => {
                                return (<Dropdown.Item key={l_index}>{l_option}</Dropdown.Item>)
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }

    return props.graphmeta.settings.map((l_setting) =>
    {
        return renderSetting(l_setting);
    });
}
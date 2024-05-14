function SettingRenderer(props)
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
                setSetting(setting, (props.graph[setting.name] != undefined) ? props.graph[setting.name] : setting.default);
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
            <div className="renderedSetting" key={setting.name}>
                <h3 className="boldText">{setting.displayname}</h3>
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
            <div className="renderedSetting" key={setting.name}>
                <h3 className="boldText">{setting.displayname}</h3>
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

    return (
        <div className="settingsBox">
            {
                props.graphmeta.settings.map((l_setting) =>
                {
                    return renderSetting(l_setting);
                })
            }
        </div>
    )
}
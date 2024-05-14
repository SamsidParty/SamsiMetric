function SettingRenderer(props)
{
    var renderSetting = (setting) =>
    {

        if (useFirstRender())
        {
            setTimeout(() =>
            {
                props.setSetting(setting, (props.settingTarget[setting.name] != undefined) ? props.settingTarget[setting.name] : setting.default);
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
                <Switch checked={(props.settingTarget[setting.name] != undefined) ? props.settingTarget[setting.name] : setting.default} onChange={(e) => { props.setSetting(setting, e.target.checked); }} />
            </div>
        )
    }

    var renderSetting_select = (setting) =>
    {
        var setSelected = (s) => {
            props.setSetting(setting, parseInt(s.currentKey));
        }

        return (
            <div className="renderedSetting" key={setting.name}>
                <h3 className="boldText">{setting.displayname}</h3>
                <Dropdown>
                    <Dropdown.Button flat color="secondary" css={{ tt: "capitalize" }}>
                        {(props.settingTarget[setting.name] != undefined) ? setting.options[props.settingTarget[setting.name]] : setting.options[setting.default]}
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
                props.settings.map((l_setting) =>
                {
                    return renderSetting(l_setting);
                })
            }
        </div>
    )
}
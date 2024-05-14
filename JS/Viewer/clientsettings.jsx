function ClientSettings() {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [page, setPage] = React.useState(SettingSchema.Client.Appearance);

    var close = () => {
        DataObject["page"] = null;
        setDataObject(Object.assign({}, DataObject));
    }

    var setSetting = (setting, value) => {
        if (!!setting.onChange) {
            setting.onChange(value);
        }
        Settings[setting.name] = value;
    }

    return (
        <Modal
            width="900px"
            closeButton
            open={true}
            onClose={close}
            className="clientSettingsModal"
        >
            <Modal.Body>
                <div className="clientSettings">
                    <div className="settingsSidebar">
                        {
                            //Load All Settings Pages Into The Sidebar
                            Object.keys(SettingSchema.Client).map((l_page) => {
                                l_page = SettingSchema.Client[l_page];
                                return (<Button onPress={() => setPage(l_page)} key={l_page.name} flat={l_page.name == page.name ? false : true} auto className="settingsSidebarButton"><i className={l_page.icon}></i>&nbsp;{l_page.name}</Button>)
                            })
                        }
                    </div>
                    <div className="settingsPanel">
                        <h2>{page.name}</h2>
                        <SettingRenderer key={UUID()} settings={page.settings} settingTarget={Settings} setSetting={setSetting} />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
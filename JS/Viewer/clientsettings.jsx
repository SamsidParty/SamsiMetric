function ClientSettings() {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [tab, setTab] = React.useState("appearance");

    var close = () => {
        DataObject["page"] = null;
        setDataObject(Object.assign({}, DataObject));
    }

    var changeTab = (e) => {
        setTab(e.target.value);
    }

    return (
        <Modal
            width="900px"
            closeButton
            open={true}
            onClose={close}
            className="clientSettingsModal"
        >
            <Modal.Header>
                <Text id="modal-title" b size={20}>
                    Client Settings
                </Text>
            </Modal.Header>
            <Modal.Body>
                <div className="clientSettings">
                    <div className="settingsSidebar">

                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
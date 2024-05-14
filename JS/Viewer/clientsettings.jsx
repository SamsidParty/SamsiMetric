function ClientSettings() {
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [error, setError] = React.useState("");

    var close = () =>
    {
        DataObject["page"] = null;
        setDataObject(Object.assign({}, DataObject));
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
                
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
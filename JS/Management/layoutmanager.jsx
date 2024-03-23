function AddLayout() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <>
            <Tooltip ttid="layoutmanager" {...TTContent("static", "Collect Data")}>
                <Button flat color={CurrentWorkspace(DataObject)?.tag || "secondary"}><i className="ti ti-plus"/>&nbsp;&nbsp;Add Layout</Button>
            </Tooltip>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Add Layout
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>

                </Modal.Body>
            </Modal>
        </>
    )
}
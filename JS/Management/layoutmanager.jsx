function AddLayout() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Tooltip ttid="layoutmanager" {...TTContent("static", "Collect Data")}>
                <Button onPress={() => setIsOpen(true)} flat color={CurrentWorkspace(DataObject)?.tag || "secondary"}><i className="ti ti-plus"/>&nbsp;&nbsp;Add Layout</Button>
            </Tooltip>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Add Layout
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>
                    {
                        LayoutTypes.map((l_layout) => {
                            var LayoutToRender = l_layout.render();
                            return (
                                <div className="layoutPreview" style={{ height: (l_layout.height * 0.5 + 30) + "px" }}>
                                    <LayoutToRender key={UUID()} preview={true}/>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}
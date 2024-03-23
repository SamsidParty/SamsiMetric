function AddLayout() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);

    var applyLayout = async (l_layout) => {
        var graphs = new Array(l_layout.graphcount);
        graphs.fill({});
        CurrentWorkspace(DataObject).layouts.push(
            {
                type: l_layout.name,
                graphs: graphs
            }
        );
        setDataObject(Object.assign({}, DataObject));
        await SyncWorkspaceChanges(DataObject);
        setIsOpen(false);
        await RefreshData();
    }

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
                                <div key={l_layout.name} className="layoutPreview" style={{ height: (l_layout.height * 0.5 + 30) + "px" }}>
                                    <LayoutToRender preview={true}/>
                                    <Button flat auto onPress={() => applyLayout(l_layout)}>Apply</Button>
                                </div>
                            )
                        })
                    }
                </Modal.Body>
            </Modal>
        </>
    )
}
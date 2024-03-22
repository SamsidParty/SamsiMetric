function ManageSnapshots()
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);


    return (
        <>
            <Button className="manageSnapshotsButton" flat auto onPress={() => { setIsOpen(true); }}><i className="ti ti-timeline"></i>&nbsp;&nbsp;Snappers</Button>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Manage Snappers
                    </Text>
                </Modal.Header>
                <Modal.Body css={{ padding: "25px" }}>

                </Modal.Body>
            </Modal>
        </>
    );

}
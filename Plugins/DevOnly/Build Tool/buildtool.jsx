function BuildToolTopbarExtension() {

    var [isOpen, setIsOpen] = React.useState(false);

    return (
        <>
            <Tooltip ttid="DevModeBuildTools_TopbarIcon" {...TTContent("static", "Developer Mode Build Tools")}>
                <Button onPress={() => setIsOpen(true)} className="iconButton iconButtonLarge" flat auto color={CurrentWorkspace(window.lastDataObject)?.tag || "secondary"}><i className="ti ti-code-dots" /></Button>
            </Tooltip>
            <Modal width="420px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Build Tool
                    </Text>
                </Modal.Header>
                <Modal.Body>

                </Modal.Body>
            </Modal>
        </>
    )
}

PluginAPI.registerPlugin("DevMode Build Tool", () => {
    PluginAPI.mountToSurface("topbar", BuildToolTopbarExtension);
});
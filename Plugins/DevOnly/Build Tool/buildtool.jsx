function BuildToolTopbarExtension() {

    var [isOpen, setIsOpen] = React.useState(false);
    var [buildName, setBuildName] = React.useState(new Date().getFullYear() + ".1t");
    var buildPath = "./Plugins/DevOnly/Build%20Tool/build.php";

    var createBuild = () => {
        localStorage.buildParamName = buildName;
        var buildWindow = window.open(buildPath);

        checkBuildFinished(buildWindow);
    }

    var checkBuildFinished = (buildWindow) => {
        if (localStorage.buildFinished == "true") {
            localStorage.buildFinished = "false";
            onBuildFinished(buildWindow);
            return;
        }
        setTimeout(() => checkBuildFinished(buildWindow), 10);
    }

    var onBuildFinished = (buildWindow) => {
        buildWindow.close()
        localStorage.buildParamName = false;
        setIsOpen(false);
    }

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
                    <Input placeholder="Build Name" initialValue={buildName} onChange={(e) => setBuildName(e.target.value)}></Input>
                    <div className="flexx fillx fjend">
                        <Button auto onPress={createBuild}>Create Build</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

PluginAPI.registerPlugin("DevMode Build Tool", () => {
    PluginAPI.mountToSurface("topbar", BuildToolTopbarExtension);
});
function BuildToolTopbarExtension() {
    return (
        <>
            <Button onPress={alert} className="iconButton iconButtonLarge" flat auto color={CurrentWorkspace(window.lastDataObject)?.tag || "secondary"}><i className="ti ti-code-dots" /></Button>
        </>
    )
}

PluginAPI.registerPlugin("DevMode Build Tool", () => {
    PluginAPI.mountToSurface("topbar", BuildToolTopbarExtension);
    PluginAPI.mountToSurface("sidebar", BuildToolTopbarExtension);
});
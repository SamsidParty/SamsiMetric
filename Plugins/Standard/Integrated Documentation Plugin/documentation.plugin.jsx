PluginAPI.registerPlugin("Integrated Documentation Plugin", () => {
    PluginAPI.mountToSurface("sidebar", DocumentationExtensionSideBar);
});

function DocumentationExtensionSideBar() {
    return (
        <div className="sidebarDocumentation">
            <div className="sidebarDocumentationHeader" style={{ width: "80%" }}>
                <h3 className="boldText taleft">DOCUMENTATION</h3>
            </div>
        </div>
    )
}
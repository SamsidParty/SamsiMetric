PluginAPI.registerPlugin("Integrated Documentation Plugin", () => {
    PluginAPI.mountToSurface("sidebar", DocumentationExtensionSideBar);
});

function DocumentationExtensionSideBar() {

    var [dataProvider, setDataProvider] = React.useState(null);

    if (!window.ReactComplexTree) {
        setTimeout(() => {
            LoadComplexTree();

            var items = {
                root: {
                    index: 'root',
                    isFolder: true,
                    children: ['child1', 'child2'],
                    data: 'Root item',
                },
                child1: {
                    index: 'child1',
                    children: [],
                    data: 'Child item 1',
                },
                child2: {
                    index: 'child2',
                    isFolder: true,
                    children: ['child3'],
                    data: 'Child item 2',
                },
                child3: {
                    index: 'child3',
                    children: [],
                    data: 'Child item 3',
                },
            };

            var dp = new ReactComplexTree.StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));
            setDataProvider(dp);
        }, 0);
    }



    return (
        <div className="sidebarDocumentation">
            <div className="sidebarDocumentationHeader" style={{ width: "80%" }}>
                <h3 className="boldText taleft">DOCUMENTATION</h3>
            </div>
            <div className="docList">
                <Button
                    flat
                    className="openDocsButton"
                    color={"success"}
                >
                    <div key={UUID()} style={{ backgroundColor: tagColors["success"] }} className="openDocsButtonIcon">
                        <i style={{ color: "white" }} className="ti ti-chevron-right"></i>
                    </div>
                    <h3>Open Documentation</h3>
                </Button>
                {
                    !!dataProvider ?
                        (
                            <>
                                <ReactComplexTree.UncontrolledTreeEnvironment

                                    dataProvider={dataProvider}
                                    getItemTitle={item => item.data}
                                    viewState={{}}
                                    canDragAndDrop={true}
                                    canDropOnFolder={true}
                                    canReorderItems={true}

                                >
                                    <ReactComplexTree.Tree treeId="docs-tree" rootItem="root" treeLabel="Documentation" />
                                </ReactComplexTree.UncontrolledTreeEnvironment>
                            </>
                        )
                        : null
                }
            </div>

        </div>
    )
}
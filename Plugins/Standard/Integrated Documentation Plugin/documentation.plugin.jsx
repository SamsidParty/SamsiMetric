PluginAPI.registerPlugin("Integrated Documentation Plugin", () => {
    PluginAPI.mountToSurface("sidebar", DocumentationExtensionSideBar);
});

function DocumentationExtensionSideBar() {

    var [dataProvider, setDataProvider] = React.useState(null);

    if (!window.Docplugin_rct) {
        setTimeout(async () => {
            LoadComplexTree();

            //Find DocMap And Load It Into The Tree Provider
            var docMapURL = "./Plugins/Standard/Integrated%20Documentation%20Plugin/Docs/docmap.json";
            var req = await fetch(docMapURL);
            var docMap = await req.json();
            
            //Scope To Doc Files
            docMap = docMap;
            docMap = ArrayValue(docMap, "name", "software").dir;
            docMap = ArrayValue(docMap, "name", "samsimetric").dir;

            var items = {
                root: {
                    index: 'root',
                    isFolder: true,
                    children: [],
                    data: 'Root Item',
                }
            };

            items.root.children = docMap.map((l_item) => l_item.id);

            var recurseDocMap = (scope) => {
                return scope.map((l_item) => {
                    if (l_item.dir) {
                        items[l_item.id] = {
                            index: l_item.id,
                            isFolder: true,
                            children: recurseDocMap(l_item.dir),
                            data: l_item.name
                        }
                    }
                    else {
                        items[l_item.id] = {
                            index: l_item.id,
                            isFolder: false,
                            data: l_item.file.replace(".md", "")
                        }
                    }

                    return l_item.id;
                });
            }

            recurseDocMap(docMap);

            console.log(items);

            var dp = new Docplugin_rct.StaticTreeDataProvider(items, (item, newName) => ({ ...item, data: newName }));
            setDataProvider(dp);
        }, 0);
    }



    return (
        <div className="sidebarDocumentation">
            <div className="sidebarDocumentationHeader" style={{ width: "80%" }}>
                <h3 className="boldText taleft">DOCUMENTATION</h3>
            </div>
            <div className="docList">
                {
                    !!dataProvider ?
                        (
                            <>
                                <Docplugin_rct.UncontrolledTreeEnvironment

                                    dataProvider={dataProvider}
                                    getItemTitle={item => item.data}
                                    viewState={{}}
                                    canDragAndDrop={false}
                                    canDropOnFolder={false}
                                    canReorderItems={false}

                                >
                                    <Docplugin_rct.Tree className="docTree" treeId="docs-tree" rootItem="root" treeLabel="Documentation" />
                                </Docplugin_rct.UncontrolledTreeEnvironment>
                            </>
                        )
                        : null
                }
            </div>

        </div>
    )
}
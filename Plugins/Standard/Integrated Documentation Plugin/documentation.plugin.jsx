PluginAPI.registerPlugin("Integrated Documentation Plugin", () => {
    PluginAPI.mountToSurface("sidebar", DocumentationExtensionSideBar);
});

function DocumentationExtensionSideBar() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [dataProvider, setDataProvider] = React.useState(null);

    if (!window.Docplugin_rct && !window.loadingRCT) {
        setTimeout(async () => {

            window.loadingRCT = true;
            window.validDocs = [];

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

                        window.validDocs.push(l_item.id);
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


    var navigateToDocument = (id) => {
        if (window.validDocs.includes(id)) {
            window.lastDocumentationID = id;
            DataObject["page"] = "DocumentationFramePage";
            setExtRedraw(UUID());
        }
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
                                    canRename={false}
                                    canSearch={false}
                                    disableMultiSelect={true}
                                    onSelectItems={(docs) => navigateToDocument(docs[0])}

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

function DocumentationFramePage() {
    //The Documentation Iframe Is Served From SamsidParty's Proprietary Documentation System
    //This Is Because SamsidParty's Markdown Variation Supports Additional Features (Like Accordions)
    //You Can Replace This URL With Whatever You Want By Setting localStorage.exp_docURL
    //The ID Of The Doc Will Be Appended To It (Like #12345678)
    var docURL = localStorage.exp_docURL || "https://www.samsidparty.com/docs/software/samsimetric";

    return (
        <iframe allowtransparency="true" className="documentationFrame" key={window.lastDocumentationID} src={docURL + window.lastDocumentationID}>

        </iframe>
    )
}
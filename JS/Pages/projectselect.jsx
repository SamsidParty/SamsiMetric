var DataContext = React.createContext(null);
var DummyData = {
    "schema": [],
    "data": {

    },
    "selected_project": ""
}

var extDataObject;
var setExtDataObject;
var setExtRedraw;
var dataStatus = "success";

function ProjectSelectModal()
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    if (useFirstRender()) {
        setTimeout(async () => {
            await RefreshData();
        }, 0);
    }

    var onSelect = (id) => {
        localStorage.lastProject = id;
        window.location.href = "./Dashboard";
    }

    return (
        <ClientImage background="true" className="setupPage" src="./Images/BackgroundDecoration.jpg">
            <div className="setupContainer">
                <div className="setupModal selectProjectModal">
                    <i className="mobileOnly mobileIcon ti ti-color-swatch"></i>
                    <h1>Select Project</h1>
                    <div className="projectList">
                        {
                            DataObject.schema.length > 0 ?
                            (DataObject.schema.map((l_project) => {
                                return (
                                    <div className="projectListItem" key={l_project.id}>
                                        <h2>{l_project.name}</h2>
                                        {
                                            (localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") ? 
                                            (<DeleteButton noRevert="true" onDelete={() => DeleteProject(l_project.id)}> </DeleteButton>) :
                                            null
                                        }
                                        
                                        <Button onPress={() => onSelect(l_project.id)} flat auto className="iconButton iconButtonLarge"><i className="ti ti-external-link"></i></Button>
                                    </div>
                                )
                            })) : 
                            (<p>No Projects Yet, Create One To Get Started</p>)
                        }
                    </div>
                    {
                        (localStorage.apikey_perms == "admin" || localStorage.apikey_perms == "manager") ? 
                        <Button size="lg" auto color="primary" onPress={() => CreateProjectFromTemplate("Empty")}><i className="ti ti-plus"></i> &nbsp; Create Project</Button>
                        : null
                    }
                    
                </div>
            </div>
        </ClientImage>
    );
}

async function DeleteProject(id) {
    var proj = ArrayValue(extDataObject.schema, "id", id);
    var projIndex = ArrayIndex(extDataObject.schema, "id", id);
    var queue = [];

    //Delete All Metrics
    for (var i = 0; i < proj.metrics.length; i++) {
        queue.push({ "method": "DELETE", "action": "metric_info", "type": proj.metrics.type, "metric_id": proj.metrics.id, "project_id": id });
    }

    extDataObject.schema.splice(projIndex, 1);
    queue.push({ "method": "PATCH", "action": "project_info", "body": JSON.stringify(extDataObject.schema, null, 2) })

    setExtDataObject(Object.assign({}, extDataObject));
    await ApplyQueue(queue);
}

async function CreateProjectFromTemplate(template) {
    var templateURL = `./Templates/Project/${template}/template.json`;
    var templateData = await (await fetch(templateURL)).text();

    for (var i = 0; templateData.includes("%UUID" + i + "%"); i++) {
        templateData = templateData.replaceAll("%UUID" + i + "%", UUID());
    }

    window.lastDataObject.schema.push(JSON.parse(templateData));

    var paramHeader = { "method": "PATCH", "action": "project_info", "body": "" };

    await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": JSON.stringify(paramHeader) }),
        method: paramHeader.method,
        body: JSON.stringify(window.lastDataObject["schema"], null, 2)
    });

    await RefreshData();
}

function ProjectSelect()
{
    var [DataObject, setDataObject] = React.useState(DummyData);
    setExtDataObject = setDataObject;
    extDataObject = DataObject;

    var [redraw, setRedraw] = React.useState(UUID());
    setExtRedraw = setRedraw;

    return (
        <DataContext.Provider value={{ DataObject: DataObject, setDataObject: setDataObject }}>
            <NextUI.NextUIProvider theme={theme}>
                <ProjectSelectModal></ProjectSelectModal>
            </NextUI.NextUIProvider>
        </DataContext.Provider>
    );
}
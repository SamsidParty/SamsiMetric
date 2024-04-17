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
                <div className="setupModal">
                    <h1>Select Project</h1>
                    <div className="projectList">
                        {
                            DataObject.schema.map((l_project) => {
                                return (
                                    <div className="projectListItem" key={l_project.id}>
                                        <h2>{l_project.name}</h2>
                                        <Button onPress={() => onSelect(l_project.id)} flat auto className="iconButton iconButtonLarge"><i className="ti ti-external-link"></i></Button>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </ClientImage>
    );
}

async function CreateProjectFromTemplate(template) {
    var templateURL = `./Templates/Project/${template}/template.json`;
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
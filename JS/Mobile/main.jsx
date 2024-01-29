
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

var busy = 0;


function MainApp() {

    //Contains Project Schema & User Data
    var [DataObject, setDataObject] = React.useState(DummyData);
    var [Redraw, setRedraw] = React.useState("");
    extDataObject = DataObject;
    setExtDataObject = setDataObject;
    setExtRedraw = setRedraw;

    var props = [];

    if (useFirstRender())
    {
        window.DataContext = React.createContext(null);

        setTimeout(async () =>
        {
            await RefreshData();

            //Check If Last Project Is Valid
            if (DataIsValid() && ArrayValue(extDataObject["schema"], "id", localStorage.lastProject).length == 0){
                localStorage.lastProject = extDataObject["schema"][0]["id"];
            }

            //Make Some Changes
            extDataObject["selected_project"] = localStorage.lastProject;
            setDataObject(Object.assign({}, extDataObject));
        }, 0);
    }

    return (
        <>
            <DataContext.Provider value={{ DataObject: DataObject, setDataObject: setDataObject }}>
                <div className="mobileLayout">
                    {/*
                        DataIsValid() ? 
                        <>
                            <MetricGraph cardSize="csMedLong" {...props} graphIndex={0} graph={{"for": "1701850214507fc9b8480-f26d-4e95-b95b-ba6de6e21ef8","type": "num_0","prefixunit": false }} />
                            <MetricGraph cardSize="csShortLong" {...props} graphIndex={1} graph={{"for": "170185025816494de65cb-ac1c-4bc6-8a80-1f575bc7b26e","type": "progress_0"}} />
                            <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={{"for": "170185025816494de65cb-ac1c-4bc6-8a80-1f575bc7b26e","type": "pie_0", "hollow": true,"showicon": true}} />
                        </> :
                        <></>*/
                    }
                </div>
                <Button onPress={() => { localStorage.clear(); location.reload() }}>Log Out</Button>
            </DataContext.Provider>
        </>
    )
}
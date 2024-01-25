//The Host App Will Add Data To This When Returning Data
window.returnQueue = {};
window.devMode = true;

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

console.log = (data) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({
        RunOnGlobal: "consolelog",
        Param1: data
    }));
}

var busy = 0;
var loadedBinaryDependencies = {};

window.LoadBinaryDependency = async (dep, value) => {
    busy++;
    loadedBinaryDependencies[atob(dep)] = URL.createObjectURL(await (await fetch(value)).blob());
    busy--;
}

window.LoadCSSDependency = async (css) => {
    await WaitUntil(() => busy == 0);

    css = atob(css); // The Mobile Client Encodes The CSS Unlike The Desktop Client

    //Replace LOADER_LOAD_BIN Queries With Data URLs
    Object.entries(loadedBinaryDependencies).forEach((l_dep) => {
        css = css.replaceAll(`./LOADER_LOAD_BIN/${l_dep[0]}/FINISH`, l_dep[1]);
    });


    var tag = document.createElement('style');
    tag.textContent = css;
    document.head.append(tag);
}

window.alert = (title, data) => {
    window.ReactNativeWebView.postMessage(JSON.stringify({
        RunOnGlobal: "alert",
        Param1: title,
        Param2: data
    }));
}

window.prompt = async (options) => {

    var request = UUID();

    window.ReactNativeWebView.postMessage(JSON.stringify({
        RunOnGlobal: "prompt",
        Param1: JSON.stringify(options),
        Param2: request
    }));

    return await new Promise((resolve, reject) => {
        window.returnQueue[btoa(request)] = (data) => {
            resolve(data);
            return true;
        }
    });
}

window.GetFromGlobal = async (get) => {
    var request = UUID();

    window.ReactNativeWebView.postMessage(JSON.stringify({
        GetFromGlobal: get,
        Request: request
    }));

    return await new Promise((resolve, reject) => {
        window.returnQueue[btoa(request)] = (data) => {
            resolve(data);
            return true;
        }
    });
}

window.onerror = console.log;
console.error = console.log;



//Tells The Host App To Load The Dependency And Waits
async function LoadDependency(dep) {

    var request = UUID();

    window.ReactNativeWebView.postMessage(JSON.stringify({
        RunOnGlobal: "loadDependency",
        Param1: dep,
        Param2: request
    }));


    return new Promise((resolve, reject) => {
        window.returnQueue[btoa(request)] = () => {
            resolve();
            return true;
        }
    });
}

function App() {

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
                    {
                        DataIsValid() ? 
                        <>
                            <MetricGraph cardSize="csMedLong" {...props} graphIndex={0} graph={{"for": "1701850214507fc9b8480-f26d-4e95-b95b-ba6de6e21ef8","type": "num_0","prefixunit": false }} />
                            <MetricGraph cardSize="csShortLong" {...props} graphIndex={1} graph={{"for": "170185025816494de65cb-ac1c-4bc6-8a80-1f575bc7b26e","type": "progress_0"}} />
                            <MetricGraph cardSize="csMedLong" {...props} graphIndex={1} graph={{"for": "170185025816494de65cb-ac1c-4bc6-8a80-1f575bc7b26e","type": "pie_0", "hollow": true,"showicon": true}} />
                        </> :
                        <></>
                    }
                </div>
                <Button onPress={() => { localStorage.clear(); location.reload() }}>Log Out</Button>
            </DataContext.Provider>
        </>
    )
}

//Init Sequence
setTimeout(async () => {
    try{
        await LoadDependency("./JS/Mobile/postloader.js");
        await LoadAllDependencies();
    }
    catch (ex) {
        console.log(ex.toString());
    }
}, 0)


function ReferenceComponents() {
    window.Button = NextUI.Button;
}
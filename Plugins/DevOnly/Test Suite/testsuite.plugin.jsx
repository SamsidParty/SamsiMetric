//Name: The Name Of The Test
//Run: The Function To Run
//Assert: The Function That Checks Whether The Test Was Successful
window.TestSuiteTests = [
    {
        "name": "Prepare",
        "run": () => { 
            window.LastBackend = Backend;
            window.Backend = "./Plugins/DevOnly/Test%20Suite/mock_backend.php";

            var dataObject = window.lastDataObject;
            dataObject.selected_project = "mock-project";
            dataObject.selected_workspace = "mock-id-1";
            setExtDataObject(Object.assign({}, dataObject));
        }
    },
    {
        "name": "RefreshData",
        "run": RefreshData,
        "assert": () => dataStatus != "error"
    },
    {
        "name": "Service Worker MessagePack Encode",
        "run": async (c) => { window.TestSuite_MSGPackEncode = await SWMessagePack.encodeAsync(["Test", "Suite", c.id, "Encode", "Test"]); },
        "assert": (c) => (!!window.TestSuite_MSGPackEncode && (MessagePack.decode(window.TestSuite_MSGPackEncode)[2]) == c.id)
    },
    {
        "name": "Service Worker MessagePack Decode",
        "run": (c) => { window.TestSuite_MSGPackDecode = MessagePack.encode(["Test", "Suite", c.id, "Decode", "Test"]); },
        "assert": async (c) => (!!window.TestSuite_MSGPackDecode && ((await SWMessagePack.decodeAsync(window.TestSuite_MSGPackDecode))[2]) == c.id)
    },
    {
        "name": "Clean Up",
        "run": async () => {
            window.Backend = window.LastBackend;

            var dataObject = window.lastDataObject;
            dataObject["selected_project"] = localStorage.lastProject;
            dataObject["selected_workspace"] = localStorage.lastWorkspace;
            setExtDataObject(Object.assign({}, dataObject));

            await RefreshData();
        },
        "assert": () => dataStatus != "error"
    },
]
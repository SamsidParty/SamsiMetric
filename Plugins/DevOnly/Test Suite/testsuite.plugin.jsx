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
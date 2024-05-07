//Name: The Name Of The Test
//Run: The Function To Run
//Assert: The Function That Checks Whether The Test Was Successful
window.TestSuiteTests = [
    {
        "name": "Prepare",
        "run": () => { window.Backend = "./Plugins/DevOnly/Test%20Suite/mock_backend.php"; }
    },
    {
        "name": "RefreshData",
        "run": RefreshData,
        "assert": () => dataStatus != "error"
    },
]
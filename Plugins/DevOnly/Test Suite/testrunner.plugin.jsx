PluginAPI.registerPlugin("Test Suite", () => {
    PluginAPI.mountToSurface("topbar", TestSuiteTopBar);
});

function TestSuiteTopBar() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [testResults, setTestResults] = React.useState([]);
    window.lastTestResults = testResults;

    var onTestFinished = async (result) => {

        //Remove Last Result, Which Is A Loading State
        var newResults = window.lastTestResults.map((e) => e); // Clone Array
        newResults.pop();
        setTestResults(newResults);

        await SkipFrame();

        pushResult(result);
    }

    var pushResult = (result) => {
        var newResults = window.lastTestResults.map((e) => e); // Clone Array
        newResults.push(result);
        setTestResults(newResults);
    }

    return (
        <>
            <Tooltip ttid="DevModeBuildTools_TopbarIcon" {...TTContent("static", "Developer Mode Build Tools")}>
                <Button onPress={() => setIsOpen(true)} className="iconButton iconButtonLarge" flat auto color={CurrentWorkspace(window.lastDataObject)?.tag || "secondary"}><i className="ti ti-test-pipe" /></Button>
            </Tooltip>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Test Suite
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {
                        testResults?.map((l_result) => {
                            return (
                            <div key={UUID()} className="testRunnerResult">
                                {
                                    //Green Checkmark
                                    l_result.startsWith("[PASS]") ? (<i className="ti ti-check"></i>) : null
                                }
                                {
                                    //Red X
                                    l_result.startsWith("[FAIL]") ? (<i className="ti ti-x"></i>) : null
                                }
                                {
                                    //Loading Wheel
                                    l_result.startsWith("[RUNNING]") ? (<LoadingWheel></LoadingWheel>) : null
                                }
                                <p>{l_result}</p>
                            </div>
                            )
                        })
                    }
                    <div className="flexx fillx fjend">
                        <Button auto onPress={() => { setTestResults([]); RunAllTests(pushResult, onTestFinished); }}>Start Tests</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

//Iterates Through All Tests And Runs Them
async function RunAllTests(pushResult, onTestFinished) {
    await SkipFrame();
    for (var i = 0; i < window.TestSuiteTests.length; i++) {
        pushResult("[RUNNING] " + window.TestSuiteTests[i].name)
        await RunTest(window.TestSuiteTests[i], onTestFinished);
    }
}

async function RunTest(test, onTestFinished) {

    var testContext = {
        id: UUID() // Unique To Each Run Of Each Test, Used Mostly In Assert To Check If The Action Worked
    }

    try {
        //Run Test
        await test.run(testContext);

        //Check Result
        if (test.assert && !await test.assert(testContext)) {
            throw new Error(`Assertion Failed {${test.assert.toString()} returned false}`)
        }

        await onTestFinished("[PASS] " + test.name);
    }
    catch (ex) {
        await onTestFinished(`[FAIL] ${test.name} (${ex})`);
    }

    await SkipFrame(); // Needed To Prevent setTestResults From Messing Up
}
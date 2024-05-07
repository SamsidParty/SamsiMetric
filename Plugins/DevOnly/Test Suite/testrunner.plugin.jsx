PluginAPI.registerPlugin("Test Suite", () => {
    PluginAPI.mountToSurface("topbar", TestSuiteTopBar);
});

function TestSuiteTopBar() {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [testResults, setTestResults] = React.useState([]);
    window.lastTestResults = testResults;

    var onTestFinished = (result) => {
        var newResults = window.lastTestResults.map((e) => e); // Clone Array
        newResults.push(result);
        setTestResults(newResults);
    }

    return (
        <>
            <Tooltip ttid="DevModeBuildTools_TopbarIcon" {...TTContent("static", "Developer Mode Build Tools")}>
                <Button onPress={() => setIsOpen(true)} className="iconButton iconButtonLarge" flat auto color={CurrentWorkspace(window.lastDataObject)?.tag || "secondary"}><i className="ti ti-test-pipe" /></Button>
            </Tooltip>
            <Modal width="420px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Test Suite
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    {
                        testResults?.map((l_result) => {
                            return (
                            <div className="testRunnerResult">
                                {
                                    //Green Checkmark
                                    l_result.startsWith("[PASS]") ? (<i className="ti ti-check"></i>) : null
                                }
                                {
                                    //Red X
                                    l_result.startsWith("[FAIL]") ? (<i className="ti ti-x"></i>) : null
                                }
                                <p key={UUID()}>{l_result}</p>
                            </div>
                            )
                        })
                    }
                    <div className="flexx fillx fjend">
                        <Button auto onPress={() => { setTestResults([]); RunAllTests(onTestFinished); }}>Start Tests</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

//Iterates Through All Tests And Runs Them
async function RunAllTests(onTestFinished) {
    setTimeout(async () => {
        for (var i = 0; i < window.TestSuiteTests.length; i++) {
            await RunTest(window.TestSuiteTests[i], onTestFinished);
        }
    }, 0);
}

async function RunTest(test, onTestFinished) {
    try {
        //Run Test
        await test.run();

        //Check Result
        if (test.assert && !await test.assert()) {
            throw new Error(`Assertion Failed (${test.assert.toString()} returned false)`)
        }

        onTestFinished("[PASS] " + test.name);
    }
    catch (ex) {
        onTestFinished(`[FAIL] ${test.name} (${ex})`)
    }
}
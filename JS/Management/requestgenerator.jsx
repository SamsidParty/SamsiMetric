function GenerateRequestButton(props)
{

    var [isOpen, setIsOpen] = React.useState(false);
    var [selectedLanguage, setSelectedLanguage] = React.useState("JavaScript");
    var codeBlock = React.useRef();

    var generators = {
        "JavaScript": RequestGen_JavaScript,
        "Python": RequestGen_Python,
        "C#": RequestGen_CSharp,
    }
    
    var updateHighlight = () => {
        setTimeout(() => {
            if (codeBlock.current) {
                hljs.highlightElement(codeBlock.current);
            }
        }, 0);
    }

    React.useEffect(updateHighlight, [codeBlock.current, isOpen]);

    return (
        <>
            <Tooltip ttid={"genrequest" + props.metric.id} {...TTContent("static", "Generate API Request")}>
                <Button onPress={() => setIsOpen(true)} color={props.metric.tag} flat auto className="iconButton generateRequestButton"><i className="ti ti-code"></i></Button>
            </Tooltip>
            <Modal width="fit-content" className="requestGenerator" closeButton open={isOpen} onClose={() => setIsOpen(false)}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Generate Submit Request
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Dropdown>
                        <Dropdown.Button flat color="secondary">
                            {selectedLanguage}
                        </Dropdown.Button>
                        <Dropdown.Menu
                            selectionMode="single"
                            onSelectionChange={(e) => setSelectedLanguage(e.currentKey)}
                        >
                            <Dropdown.Item key="JavaScript">JavaScript</Dropdown.Item>
                            <Dropdown.Item key="Python">Python</Dropdown.Item>
                            <Dropdown.Item key="C#">C#</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    { /* ↓↓↓↓↓↓↓↓↓↓↓↓ Makes Sure The Element Will Be Reset Every Render */ }
                    <pre key={UUID()}><code ref={codeBlock} className="language-javascript">{generators[selectedLanguage](props.metric)}</code></pre>
                </Modal.Body>
            </Modal>
        </>
    )
}

function RequestGen_Common(metric) {

    var params = {
        functionName: "SubmitNumber",
        baseURL: window.location.href.replace("Dashboard", "API/Submit/"),
        args: {
            "number": "float"
        },
        argInfo: {
            "number": "A Floating Point Number To Submit"
        },
        data: {
            value: "$_number"
        }
    }

    if (metric.type == "country") {
        params.functionName = "SubmitCountry"
        params.args = {
            "number": "int",
            "country": "string"
        }
        params.argInfo = {
            "number": "A Floating Point Number To Submit",
            "country": "The Country To Add Data To, In 2-Digit ISO Format"
        },
        params.data = {
            value: "$_number",
            country: "$_country"
        }
    }

    return params;
}

function RequestGen_JavaScript(metric) {

    var params = RequestGen_Common(metric);

    return `
${Object.keys(params.argInfo).map((l_arginfo, l_index) => {
    return "// " + l_arginfo + ": " + params.argInfo[l_arginfo] + (l_index == Object.keys(params.argInfo).length - 1 ? "" : "\n");
}).join("")}
function ${params.functionName}(${GenerateArgs(params.args)}) {
    let id = "${metric.id}";
    let endpoint = "${params.baseURL}";
    let url = endpoint + id;
    let key = ""; // Enter Your Data Collector API Key Here

    fetch(url, {
        method: "POST",
        body: JSON.stringify(${GenerateBody(params)}),
        headers: {
            "Authorization": key,
        }
    });
}
    `.trim();
}

function RequestGen_Python(metric) {

    var params = RequestGen_Common(metric);

    return `Not Implemented`;
}

function RequestGen_CSharp(metric) {

    var params = RequestGen_Common(metric);

    return `Not Implemented`;
}

function GenerateArgs(args, typed) {
    var argString = "";
    Object.keys(args).forEach((l_arg, l_index) => {
        if (!typed) {
            argString += l_arg;
        }

        if (l_index != Object.keys(args).length - 1) {
            argString += ", "; // Argument Seperator
        }
    });
    return argString;
}

function GenerateBody(params) {
    var baseBody = JSON.stringify(params.data);

    Object.keys(params.args).forEach((l_arg, l_index) => {
        baseBody = baseBody.replaceAll(`"$_${l_arg}"`, l_arg);
    });

    return baseBody;
}
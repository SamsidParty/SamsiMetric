function GenerateRequestButton(props)
{

    var [isOpen, setIsOpen] = React.useState(false);
    var [selectedLanguage, setSelectedLanguage] = React.useState("JavaScript");
    var codeBlock = React.useRef();

    var generators = {
        "JavaScript": RequestGen_JavaScript,
        "Python": RequestGen_Python,
        "PHP": RequestGen_PHP,
    }

    var syntaxHighlighters = {
        "JavaScript": "language-javascript",
        "Python": "language-python",
        "PHP": "language-php",
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
                            <Dropdown.Item key="PHP">PHP</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    { /* ↓↓↓↓↓↓↓↓↓↓↓↓ Makes Sure The Element Will Be Reset Every Render */ }
                    <pre key={UUID()}><code ref={codeBlock} className={syntaxHighlighters[selectedLanguage]}>{generators[selectedLanguage](props.metric)}</code></pre>
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
            "number": "An Integer To Submit",
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
    let metricid = "${metric.id}";
    let endpoint = "${params.baseURL}";
    let url = endpoint + metricid;
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

    return `
import requests

${Object.keys(params.argInfo).map((l_arginfo, l_index) => {
    return "# " + l_arginfo + ": " + params.argInfo[l_arginfo] + (l_index == Object.keys(params.argInfo).length - 1 ? "" : "\n");
}).join("")}
def ${params.functionName}(${GenerateArgs(params.args)}):
    metricid = "${metric.id}"
    endpoint = "${params.baseURL}"
    url = endpoint + metricid
    key = ""; # Enter Your Data Collector API Key Here

    data = ${GenerateBody(params)}

    req = requests.post(url, json = data, headers = {"Authorization": key})
    `.trim();
}


function RequestGen_PHP(metric) {

    var params = RequestGen_Common(metric);

    return `
<?php

${Object.keys(params.argInfo).map((l_arginfo, l_index) => {
    return "// " + l_arginfo + ": " + params.argInfo[l_arginfo] + (l_index == Object.keys(params.argInfo).length - 1 ? "" : "\n");
}).join("")}
function ${params.functionName}(${GenerateArgs(params.args, false, "$")}) {
    $metricid = "${metric.id}";
    $endpoint = "${params.baseURL}";
    $url = $endpoint . $metricid;
    $key = ""; // Enter Your Data Collector API Key Here

    $data = [${Object.keys(params.data).map((l_dat) => {
        return `"${l_dat}" => ${params.data[l_dat].replaceAll("$_", "$")}`;
    })}];

    $options = [
        "http" => [
            "header" => "Authorization: $key\\r\\nContent-Type: application/json\\r\\n",
            "method" => "POST",
            "content" => json_encode($data),
        ]
    ];

    $context = stream_context_create($options);
    file_get_contents($url, false, $context);
}

?>
    `.trim();
}

function GenerateArgs(args, typed, prefix) {
    var argString = "";
    Object.keys(args).forEach((l_arg, l_index) => {
        if (typed) {
            argString += args[l_arg] + " " + (prefix ? prefix + l_arg : l_arg);
        }
        else {
            argString += (prefix ? prefix + l_arg : l_arg);
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
window.Backend = "./backend.php"
window.ProductName = document.querySelector('meta[name="product-name"]').content;
window.isMobile = document.body.classList.contains("mobile");
window.isDesktop = !isMobile;

//These Are The Colors NextUI Uses
const tagColors = {
    "success": "#17c964",
    "primary": "#0072f5",
    "secondary": "#9750dd",
    "warning": "#f5a524",
    "error": "#f31260"
}

function CurrentProject(dataObject)
{
    return ArrayValue(dataObject?.schema, "id", dataObject?.["selected_project"]);
}

function CurrentWorkspace(dataObject)
{
    var val = ArrayValue(CurrentProject(dataObject)?.workspaces, "id", dataObject?.["selected_workspace"]);
    return val.length != 0 ? val : null;
}

//Based On https://stackoverflow.com/a/2117523
function UUID() {
    var baseId = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );

    return Date.now().toString() + "-" + baseId; // Add Timestamp To Prevent Duplicates
}

function LoginWithKeyInfo(keyInfo, key)
{
    for (var [info, value] of Object.entries(keyInfo))
    {
        localStorage.setItem("apikey_" + info, value);
    }
    localStorage.setItem("apikey_value", key);
}

//It's Simpler In SQL Terms
//SELECT * FROM <arr> WHERE <key> = <value>
function ArrayValue(arr, key, value)
{
    var result = [];
    arr?.forEach(e =>
    {
        if (e[key] == value)
        {
            result = e;
        }
    });
    return result;
}

//SELECT index FROM <arr> WHERE <key> = <value>
function ArrayIndex(arr, key, value)
{
    for (var i = 0; i < arr?.length; i++)
    {
        if (arr[i][key] == value)
        {
            return i;
        }
    }
}

//Selects An Item From An Array, Adjusting To Negative And Out Of Bounds Indexes
function SafeSelect(arr, index) {
    if (index < arr.length && index >= 0) {
        return arr[index];
    }
    return arr[((index % arr.length + arr.length) % arr.length)];
}

//https://stackoverflow.com/a/12646864/18071273
function ShuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

async function RefreshData(ignoreSchema)
{
    if (dataStatus == "syncing") { return; } //Already Syncing

    setExtRedraw(UUID());

    dataStatus = "syncing";

    //Get A Fresh Database Dump
    var response = await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": '{"action":"get_data"}' })
    });

    if (!response.ok) {
        dataStatus = "error";
        return;
    }

    try{
        var json = await response.json();
    }
    catch {
        setExtRedraw(UUID());
        dataStatus = "error";
        return;
    }

    if (!ignoreSchema) {
        extDataObject["schema"] = json["schema"];
    }
    extDataObject["data"] = json["data"];

    dataStatus = "success";
    setExtDataObject(Object.assign({}, extDataObject));
}

function DataIsValid() {
    return extDataObject.schema.length > 0;
}


//Fetch With Timeouts
function tfetch(url, options) {
    return new Promise((resolve, reject) => {
        var resolved = false;
        fetch(url, options).then((data) => {
            if (!resolved) {
                resolved = true;
                resolve(data);
            }
        });
        setTimeout(() => {
            if (!resolved) {
                resolved = true;

                if (options.throw) {
                    reject("Could Not Connect To Server");
                    throw new Error("Could Not Connect To Server");
                }
                else {
                    resolve({
                        ok: false,
                        status: -1
                    });
                }
            }
        }, options.timeout);
    });
}

function DefaultHeaders(addedHeaders)
{
    var headers = {
        "X-Mode": "ControlPanel",
        "X-Client-Platform": document.body.classList.toString(),
        "X-Client-Version": document.querySelector('meta[name="client-version"]').content,
        "X-API-Key": localStorage.apikey_value
    };

    Object.assign(headers, addedHeaders);

    return headers;
}

function DefaultOptions() {
    return {
        timeout: 5000,
        throw: true
    }; // Nothing Here Yet
}

function useFirstRender()
{
    const ref = React.useRef(true);
    const firstRender = ref.current;
    ref.current = false;
    return firstRender;
}

function ValueFromNumberMetric(metric, DataObject, extraParam) {

    if (metric.type == "average") {
        var row = ArrayValue(DataObject["data"]["data_average"], "MetricID", metric.id);
        var average = parseFloat(row["Average"]).toFixed(metric["rounding"]);
        return parseFloat(average);
    }
    else if (metric.type == "total") {
        var row = ArrayValue(DataObject["data"]["data_total"], "MetricID", metric.id);
        var total = parseFloat(row["Total"]).toFixed(metric["rounding"]);
        return parseFloat(total);
    }
    else if (metric.type == "country") {
        var row = ArrayValue(DataObject["data"]["data_country"], "MetricID", metric.id);
        return parseFloat(row[extraParam || "Total"]);
    }

    return -1;
}

function FillChart(metric, DataObject, options) {

    var metrics = CurrentProject(DataObject)["metrics"];

    var values = [];
    var names = [];
    var colors = [];
    var icons = [];

    metric["dependencies"].forEach((l_dependency) =>
    {
        var dep = ArrayValue(metrics, "id", l_dependency);

        if (dep.length != 0)
        {
            var value = ValueFromNumberMetric(dep, DataObject)
            names.push(dep.name);
            values.push(parseFloat(value));
            icons.push(dep.icon);
            if (colors.length >= 5) {
                //TODO: Make A Better Color Generator
                var randomByte = () => Math.floor(Math.random() * 254);
                colors.push(`rgb(${randomByte()}, ${randomByte()}, ${randomByte()})`);
            }
            else {
                colors.push(tagColors[dep["tag"]]);
            }
        }
    });

    //Convert Values To Percentages
    if (options && options.includes("percent")) {
        var totalValue = 0;
        values.forEach((l_val) => totalValue += l_val);

        values = values.map((l_val) => {
            return Math.round((l_val / totalValue) * 100);
        });
    }

    return [values, names, colors, icons]
}

async function WaitUntil(cond) {
    if (cond()) { return; }
    const delayMs = 10;
    while(!cond()) await new Promise(resolve => setTimeout(resolve, delayMs));
}

window.RunOnLoad("./JS/ThirdParty/nextui.js", () => {
    window.theme = NextUI.createTheme({
        type: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light",
        theme: {
            colors: {

            }
        }
    })
});


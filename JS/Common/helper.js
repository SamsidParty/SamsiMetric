AutoLoadThisFile();

window.Backend = "./backend.php"
window.ProductName = document.querySelector('meta[name="product-name"]').content;
window.isMobile = window.matchMedia("(max-aspect-ratio: 10/9)").matches;
window.isDesktop = !isMobile;
window.isApple = /(iPad|iPhone|iPod)/g.test(navigator.userAgent);

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

    //Disable Management And Administration On Mobile
    if (isMobile) {
        keyInfo.perms = "viewer";
    }

    for (var [info, value] of Object.entries(keyInfo))
    {
        localStorage.setItem("apikey_" + info, value);
    }

    //Prefer Session Token Over Raw Key For Security
    if (!keyInfo.value.includes("Bearer")) {
        localStorage.setItem("apikey_value", key);
    }
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
        if (response.status == 401 || response.status == 424) {
            window.location.href = "./Login"
        }
        else if (response.status == 500) {
            window.location.href = "./Setup?reason=database"
        }
        else if (response.status == 503) {
            window.location.href = "./Setup?reason=format"
        }
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

    //Insert Extra Context
    extDataObject.syncTime = Math.floor(Date.now() / 1000)

    //Load Snapshots From Last 24 Hours
    ClearLoadedSnapshots();
    await LoadSnapshotRange({
        unix: [Math.floor(Date.now() / 1000) - 86400, Math.floor(Date.now() / 1000)],
        detail: 240
    });

    //Check If There Are No Projects, Redirect To Project Select
    if (extDataObject["schema"].length < 1 && window.location.pathname.endsWith("/Dashboard")) {
        window.location.href = "./ProjectSelect";
    }

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

//Does An Array Of Fetch Requests In The Queue Format
async function ApplyQueue(queue) {
    for (var i = 0; i < queue.length; i++)
    {
        var paramHeader = Object.assign({}, queue[i]);
        paramHeader.body = "";

        await fetch(Backend, {
            headers: DefaultHeaders({ "X-Params": JSON.stringify(paramHeader) }),
            method: queue[i]["method"],
            body: queue[i]["body"] || ""
        });
    }
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
    };
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
        return parseFloat(average) || 0;
    }
    else if (metric.type == "total") {
        var row = ArrayValue(DataObject["data"]["data_total"], "MetricID", metric.id);
        var total = parseFloat(row["Total"]).toFixed(metric["rounding"]);
        return parseFloat(total) || 0;
    }
    else if (metric.type == "country") {
        var row = ArrayValue(DataObject["data"]["data_country"], "MetricID", metric.id);
        return parseFloat(row[extraParam || "Total"]) || 0;
    }

    return -1;
}

function FillChart(metric, DataObject, options) {

    var depList = metric.dependencies;
    if (options?.snapshotMode) {
        depList = ShakeDependencyTree(metric, DataObject);
    }

    var metrics = CurrentProject(DataObject)["metrics"];

    var values = [];
    var names = [];
    var colors = [];
    var icons = [];
    var percents = [];
    var metricDatas = [];

    depList.forEach((l_dep, l_index) =>
    {
        var dep = ArrayValue(metrics, "id", l_dep);

        if (dep.length != 0)
        {
            var value = ValueFromNumberMetric(dep, DataObject);
            names.push(dep.name);
            values.push(parseFloat(value));
            icons.push(dep.icon);
            metricDatas.push(dep);
            if (colors.includes(tagColors[dep["tag"]]) && !options?.rawColor) {
                colors.push(tinycolor(tagColors[dep["tag"]]).brighten(7 * l_index).toString());
            }
            else {
                colors.push(tagColors[dep["tag"]]);
            }
        }
    });

    //Convert Values To Percentages
    percents = ConvertPercents(values);

    return [values, names, colors, icons, percents, metricDatas];
}

//Returns An Array Of IDs Of All The Dependencies Recursively With No Duplicates
function ShakeDependencyTree(metric, DataObject) {

    //There Is No Tree To Shake
    if (!metric.dependencies || metric.dependencies.length == 0) {
        return [metric.id];
    }

    var depList = [];
    metric.dependencies.forEach((l_dep) => {
        var dep = ArrayValue(CurrentProject(DataObject).metric, "id", l_dep);
        if (dep.dependencies && dep.dependencies.length > 0) {
            depList.concat(ShakeDependencyTree(dep, DataObject));
        }
        else {
            depList.push(l_dep);
        }
    });
    return depList.filter(function(item, i, ar){ return ar.indexOf(item) === i; });
}

//Converts An Array Of Numbers Into An Array Of Percents
function ConvertPercents(values, filter) {

    if (!Array.isArray(values)) {
        var totalValue = 0;
        var percentedObj = {};
        Object.keys(values).forEach((l_key) => { 
            if (parseFloat(values[l_key]) != NaN && (!filter || filter(l_key))) {
                totalValue += parseFloat(values[l_key]);
            }
        });
        Object.keys(values).forEach((l_key) => { 
            if (parseFloat(values[l_key]) != NaN && (!filter || filter(l_key))) {
                percentedObj[l_key] = ((parseFloat(values[l_key]) / totalValue) * 100).toFixed(2);
            }
            else {
                percentedObj[l_key] = values[l_key];
            }
        });

        return percentedObj;
    }

    var totalValue = 0;
    values.forEach((l_val) => totalValue += l_val);
    return values.map((l_val) => {
        return ((l_val / totalValue) * 100).toFixed(2);
    });
}

function ShortenNumber(num) {
    return (Intl.NumberFormat('en', { notation: 'compact' })).format(num);
}

async function WaitUntil(cond) {
    if (cond()) { return; }
    const delayMs = 10;
    while(!cond()) await new Promise(resolve => setTimeout(resolve, delayMs));
}

async function SkipFrame() {
    return new Promise(resolve => setTimeout(resolve, 0));
}
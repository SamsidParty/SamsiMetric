var AllMetricEditors = [
    "total",
    "average",
    "common_num",
    "country",
    "group"
]

RunOnLoad("./JS/Management/MetricEditors/common.jsx", async () => {
    //Load All Metric Editors
    for (let i = 0; i < AllMetricEditors.length; i++) {
        await LoadMetricEditor(AllMetricEditors[i]);
    }
});

async function LoadMetricEditor(editor) {
    await LoadDependency(`./JS/Management/MetricEditors/${editor}.jsx`);
}

function MetricEdit_common(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var fileInput = React.useRef();

    var uploadImage = async () =>
    {
        props.metric.icon = await UploadIconFile();
        setDataObject(Object.assign({}, DataObject));
    }

    return (
        <>
            <Input readOnly label="ID (For Use With API)" initialValue={props.metric["id"]} />
            <Input bordered label="Name" data-key={props.metric.id + "/name"} onChange={MetricDataChanged_input} placeholder={props.exampleName} initialValue={props.metric["name"]} />
            <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">Color</p>
            <ColorBar data-key={props.metric.id + "/tag"} onChange={MetricDataChanged_input} value={props.metric["tag"]}></ColorBar>
            <p style={{ fontSize: "0.875rem", marginBottom: "6px", marginLeft: "4px", letterSpacing: "initial" }} className="nextui-input-block-label">Icon</p>
            <div className="flexx gap10 faend">
                <div className="metricIcon" style={{ backgroundColor: tagColors["success"] }}>
                    <CachedIcon src={props.metric.icon}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["primary"] }}>
                    <CachedIcon src={props.metric.icon}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["secondary"] }}>
                    <CachedIcon src={props.metric.icon}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["warning"] }}>
                    <CachedIcon src={props.metric.icon}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["error"] }}>
                    <CachedIcon src={props.metric.icon}></CachedIcon>
                </div>
                <IconSelect onSelected={(e) => props.metric.icon = e}></IconSelect>
                <Button flat auto className="iconButtonLarge" onPress={uploadImage}><i className="ti ti-upload"></i></Button>
            </div>

        </>
    )
}
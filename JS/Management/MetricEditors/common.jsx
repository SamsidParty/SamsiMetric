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

    var GetMetricPreviewIcon = () =>
    {
        if (props.metric.icon.startsWith("data:image/png"))
        {
            return props.metric.icon;
        }

        return props.metric.icon;
    }

    var uploadImage = () =>
    {
        fileInput.current.click();
    }

    var finishUpload = (e) =>
    {

        if (fileInput.current.files && fileInput.current.files.length > 0)
        {
            var reader = new FileReader();
            reader.onload = function (e)
            {
                var img = document.createElement("img");
                img.onload = function (event)
                {

                    var canvas = document.createElement("canvas");
                    canvas.width = 240;
                    canvas.height = 240;

                    var width = img.width;
                    var height = img.height;

                    if (width > height)
                    {
                        if (width > 240)
                        {
                            height = height * (240 / width);
                            width = 240;
                        }
                    } else
                    {
                        if (height > 240)
                        {
                            width = width * (240 / height);
                            height = 240;
                        }
                    }

                    var ctx = canvas.getContext("2d");
                    ctx.mozImageSmoothingEnabled = false;
                    ctx.webkitImageSmoothingEnabled = false;
                    ctx.msImageSmoothingEnabled = false;
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(img, (240 - width) / 2, (240 - height) / 2, width, height);
                    var dataurl = canvas.toDataURL("image/png");
                    props.metric.icon = dataurl;
                    setDataObject(Object.assign({}, DataObject));
                }
                img.src = e.target.result;
            }
            reader.readAsDataURL(fileInput.current.files[0]);
        }

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
                    <CachedIcon src={GetMetricPreviewIcon()}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["primary"] }}>
                    <CachedIcon src={GetMetricPreviewIcon()}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["secondary"] }}>
                    <CachedIcon src={GetMetricPreviewIcon()}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["warning"] }}>
                    <CachedIcon src={GetMetricPreviewIcon()}></CachedIcon>
                </div>
                <div className="metricIcon" style={{ backgroundColor: tagColors["error"] }}>
                    <CachedIcon src={GetMetricPreviewIcon()}></CachedIcon>
                </div>
                <IconSelect metric={props.metric}></IconSelect>
                <Button flat auto className="iconButtonLarge" onPress={uploadImage}><i className="ti ti-upload"></i></Button>
                <input type="file" onChange={finishUpload} accept=".png,.jpg,.jpeg" ref={fileInput} style={{ display: "none" }}></input>
            </div>

        </>
    )
}
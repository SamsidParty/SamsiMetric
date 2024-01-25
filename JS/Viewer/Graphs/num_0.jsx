function Graphnum_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var displayValue = ValueFromNumberMetric(metric, DataObject).toLocaleString("en-US");
    var textSize = 0;

    if (props.cardSize == "csMedLong") {
        textSize = ScaleText(displayValue, 14, 39, 10);
    }
    else if (props.cardSize == "csShortLong") {
        textSize = 14;
    }

    return (
        <div style={props.style} className={"layoutCard graphNum0 " + props.cardSize}>
            <GraphCommon {...props} />
            <div className="leftBar" style={{backgroundColor: tagColors[metric.tag]}}><CachedIcon src={metric.icon}></CachedIcon></div>
            <div className="subCard">
                <h3>{metric.name}</h3>
                <div className="numberBox">
                    <h1 style={{ fontSize: `calc(${textSize}px * var(--card-scale))` }}>{props.graph.prefixunit ? metric.unit : ""}{displayValue}</h1>
                    <h3>{props.graph.prefixunit ? "" : metric.unit}</h3>
                </div>
            </div>
        </div>
    )
}
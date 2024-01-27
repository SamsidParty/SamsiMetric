function Graphnum_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var displayValue = ValueFromNumberMetric(metric, DataObject).toLocaleString("en-US");

    return (
        <div style={props.style} className={"layoutCard graphNum0 " + props.cardSize}>
            <GraphCommon {...props} />
            <div className="leftBar" style={{backgroundColor: tagColors[metric.tag]}}><CachedIcon src={metric.icon}></CachedIcon></div>
            <div className="subCard">
                <h3>{metric.name}</h3>
                <div className="numberBox">
                    <div className="numValueHolder">
                        <AutoTextSize className="numValue" maxFontSizePx={props.cardSize == "csMedLong" ? 39 : 14} mode="oneline">{props.graph.prefixunit ? metric.unit : ""}{displayValue}</AutoTextSize>
                        <h3>{props.graph.prefixunit ? "" : metric.unit}</h3>
                    </div>
                </div>
            </div>
        </div>
    )
}
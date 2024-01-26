
//Register Tooltip
var progressGraphTooltipTemplate = {
    content: (param) => `${param[0]}: ${param[1]}`, // 0: Metric Name, 1: Metric Value
    placement: "bottom"
}
if (window.tooltipTemplates) {
    window.tooltipTemplates["progressgraph"] = progressGraphTooltipTemplate;
}
else {
    RunOnLoad("./JS/Viewer/tooltip.jsx", async () => window.tooltipTemplates["progressgraph"] = progressGraphTooltipTemplate);
}

function Graphprogress_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, DataObject, ["percent"]);

    var values = chartFill[0];
    var names = chartFill[1];
    var colors = chartFill[2];
    var icons = chartFill[3];
    var percents = chartFill[4];

    //Add Dummy Data If No Submetrics Assigned
    if (names.length == 0)
    {
        names.push("No Data");
        values.push(404);
        colors.push(tagColors.error);
        icons.push("default.png");
    }

    return (
        <div style={props.style} className={"layoutCard graphProgress0 " + props.cardSize}>
            <GraphCommon {...props} />
            
            <div className="leftBar" style={{backgroundColor: tagColors[metric.tag]}}><CachedIcon src={metric.icon}></CachedIcon></div>
            <div className="subCard">
                <h3>{metric.name}</h3>
                <div className="progressBar">
                    {
                        names.map((l_name, l_index) => {

                            var showIcon = (percents[l_index] >= 14); // Don't Show Icon If The Metric Takes Up Less Than 14% Of The Bar (13% Is The Squish Point)

                            return (   

                                <Tooltip key={`${props.graphNonce}_${l_index}_${l_name}`} ttid={`${props.graph["for"]}_${l_index}_ProgressGraph_${l_name}`} {...TTContent("progressgraph", [names[l_index], values[l_index]])}>
                                    <div
                                        id={l_index}
                                        className="progressFill" 
                                        key={UUID()}
                                        style={{ 
                                            backgroundColor: colors[l_index],
                                            width: `calc(${percents[l_index]}% - ${(l_index != 0) ? "3" : "0"}px)`  /* There Should Be percents.length - 1 Padding Slots */ 
                                        }}
                                    >
                                        <CachedIcon style={{ display: showIcon ? "flex" : "none" }} src={icons[l_index]}/>
                                    </div>
                                </Tooltip>

 
                            );
                        })
                    }
                </div>
            </div>

        </div>
    )
}

function Graphpie_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    return (
        <div style={props.style} className={"layoutCard graphPie0 " + props.cardSize}>
            <GraphCommon {...props} />
            <div className="subCard">
                <h3>{metric.name}</h3>
                <div className="labelHolder">
                {
                    metric["dependencies"].map((l_dep) => {
                        var dep = ArrayValue(metrics, "id", l_dep);

                        if (dep.length != 0) {
                            return (<div key={l_dep} className="subCardLabel" style={{ backgroundColor: tagColors[dep.tag] }}><CachedIcon src={dep.icon}></CachedIcon></div>);
                        }
                    })
                }
                </div>
            </div>

            {
                window.ReactApexChart != undefined ?
                (<Graphpie_0_Pie {...props} />) :
                (<></>)
            }

            <div className="iconHolder" style={{ backgroundColor: tagColors[metric.tag], display: props.graph.showicon ? "flex" : "none" }}>
                <CachedIcon src={metric.icon}></CachedIcon>
            </div>

        </div>
    )
}

function Graphpie_0_Pie(props) {

    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, window.lastDataObject);

    var values = chartFill[0];
    var names = chartFill[1];
    var colors = chartFill[2];

    //Add Dummy Data If No Submetrics Assigned
    if (names.length == 0)
    {
        names.push("No Data");
        values.push(404);
        colors.push(tagColors.error);
    }


    var onStartHover = (e, c, hover) => {
        //Add Tooltip
        var numFormatter = Intl.NumberFormat('en', { notation: 'compact' }); // Add K, M, etc To Numbers To Shorten Them
        window.lastTTText = `${metric.name}: ${numFormatter.format(values[hover.dataPointIndex])}`;
        window.lastTTKey = props.graphNonce;
        window.lastTTPlacement = "bottom";
    }

    var onEndHover = (e, context) => {
        //Remove Tooltip
        if (window.lastTTKey == props.graphNonce) {
            window.lastTTText = "";
            window.lastTTKey = "";
        }
    }

    var chartData = {
        options: {
            chart: {
                background: "transparent",
                animations: {
                    enabled: false
                },
                foreColor: "var(--col-text)",
                sparkline: {
                    enabled: true
                },
                parentHeightOffset: 0,
                events: {
                    dataPointMouseEnter: onStartHover,
                    dataPointMouseLeave: onEndHover
                }
            },
            stroke: { show: false },
            tooltip: { enabled: false },
            dataLabels: { enabled: false },
            plotOptions: {
                pie: {
                    expandOnClick: false,
                }
            },
            colors: colors,
            labels: names,
            grid: {
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0
                }
            }
        },
        series: values
    }

    return (
        <Chart
        options={chartData.options}
        series={chartData.series}
        className="graphChart"
        key={props.isPreview ? UUID() : metric.id}
        type={props.graph.hollow ? "donut" : "pie" /* Updates Every Time Only If We Are In Preview Mode*/}
        width={ScaleGraph(props.cardSize, true) * 115}
        height={ScaleGraph(props.cardSize, true) * 115}
        />
    )
}
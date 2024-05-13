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
                window.ChartJSPie != undefined ?
                    (<Graphpie_0_Pie {...props} />) :
                    (<GraphLoading {...props}></GraphLoading>)
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
    if (names.length == 0) {
        names.push("No Data");
        values.push(404);
        colors.push(tagColors.error);
    }


    var options = {
        responsive: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false,
                intersect: false,
                position: "nearest",
                external: window.ChartJSTooltipInterop,
            },
            dashedline: {
                color: 'transparent', // Disable On This Chart
            },
            datalabels: {
                color: 'transparent'
            }
        }
    }

    var chartData = {
        labels: names,
        datasets: [
            {
                label: "",
                data: values,
                backgroundColor: colors,
                borderColor: colors,
            }
        ]
    };

    //Choose Type Based On If Hollow
    var ChartToRender = props.graph.hollow ? ChartJSDoughnut : ChartJSPie;   

    return (
        <ChartToRender
            options={options}
            data={chartData}
            className="graphChart"
            width={(ScaleGraph(props.cardSize, true) * 115)}
            height={(ScaleGraph(props.cardSize, true) * 115)}
            key={props.isPreview ? UUID() : metric.id /* Updates Every Time Only If We Are In Preview Mode*/}
        />
    )
}
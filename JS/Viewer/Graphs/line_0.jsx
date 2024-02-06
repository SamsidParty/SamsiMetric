function Graphline_0(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);


    return (
        <div style={props.style} className={"layoutCard graphLine0 " + props.cardSize}>
            <GraphCommon {...props} />
            {
                window.ReactApexChart != undefined ?
                    (<Graphline_0_Line {...props} />) :
                    (<></>)
            }
        </div>
    )
}

function Graphline_0_Line(props)
{
    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, window.lastDataObject);

    var names = chartFill[1];
    var colors = chartFill[2];

    var chartData = {
        options: {
            chart: {
                sparkline: {
                    enabled: true
                },
                toolbar: {
                    show: false,
                }
            },
            grid: {
                show: false,
                padding: {
                    top: 15,
                    right: 0,
                    bottom: 5,
                    left: 0
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false,
            },
            stroke: {
                width: 4
            },
            colors: colors
        },
        series: [
            {
                name: names[0],
                data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 1.2]
            },
            {
                name: names[1],
                data: [20, 29, 37, 36, 44, 45, 50, 12]
            }
        ]
    }

    return (
        <Chart
            options={chartData.options}
            series={chartData.series}
            className="graphChart"
            key={props.isPreview ? UUID() : metric.id /* Updates Every Time Only If We Are In Preview Mode*/}
            type={"line"}
            width={310}
            height={140}
        />
    )
}
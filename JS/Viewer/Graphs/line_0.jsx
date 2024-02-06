function Graphline_0(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    //Check If Self Or Any Dependencies Have Snaphots
    var hasSnapshots = SnapshotAt(metric.id, Infinity) != null;
    var tree = ShakeDependencyTree(metric, DataObject);
    tree.forEach((l_dep) =>
    {
        if (SnapshotAt(l_dep, Infinity) != null)
        {
            hasSnapshots = true;
        }
    });

    return (
        <div style={props.style} className={"layoutCard graphLine0 " + props.cardSize}>
            <GraphCommon {...props} />
            {(() =>
            {
                if (!hasSnapshots)
                {
                    //No Snapshots Available
                    return (<i className="ti ti-hourglass-empty"></i>);
                }
                else if (window.ReactApexChart == undefined)
                {
                    //Still Loading
                    return (<></>);
                }
                else
                {
                    //Render The Graph
                    return (<Graphline_0_Line {...props} />);
                }
            })()}
        </div>
    )
}

function Graphline_0_Line(props)
{
    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, window.lastDataObject, { snapshotMode: true });

    //Time Ranges
    //0: Past Hour
    //1: Past 24 Hours
    //2: Past Week
    //3: Past Year
    var timeRange = props.graph.timeRange || 0;
    var timeRangeUnix = [0, 0];
    var unixSeconds = Math.floor(Date.now() / 1000);
    var detail = 24;

    if (timeRange == 0)
    {
        timeRangeUnix = [unixSeconds - 3600, unixSeconds];
    }
    else if (timeRange == 1)
    {
        timeRangeUnix = [unixSeconds - 86400, unixSeconds];
    }
    else if (timeRange == 2)
    {
        timeRangeUnix = [unixSeconds - 604800, unixSeconds];
    }
    else if (timeRange == 3)
    {
        timeRangeUnix = [unixSeconds - 31536000, unixSeconds];
    }

    var [isDataLoaded, setIsDataLoaded] = React.useState(false);

    setTimeout(async () =>
    {
        if (!isDataLoaded)
        {
            await LoadSnapshotRange(timeRangeUnix[0], timeRangeUnix[1]);
            setIsDataLoaded(true);
        }
    }, 0);


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
                },
                animations: {
                    enabled: false
                }
            },
            grid: {
                show: false,
                padding: {
                    top: 30,
                    right: 0,
                    bottom: 5,
                    left: 0
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            stroke: {
                width: 4,
                curve: 'smooth'
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: false,
                    opacityFrom: 0.5,
                    opacityTo: 0,
                    stops: [0, 90, 100],
                    colors: colors
                }
            },
            colors: colors
        },
        series: []
    }

    //Add Series Data To The Chart
    names.forEach((l_name, l_index) =>
    {
        var values = [];

        for (let i = 0; i < detail; i++)
        {
            var timeOfSnap = Math.ceil(timeRangeUnix[0] + ((Math.abs(timeRangeUnix[0] - timeRangeUnix[1]) / detail) * (i + 1)));
            var snap = SnapshotAt(metric.id, timeOfSnap);
            var stubDataObject = { data: {} };

            if (snap && snap.SnapData)
            {
                stubDataObject.data[SnapshotTables[metric.type]] = JSON.parse(snap.SnapData);
                values.push({
                    x: UUID(),
                    y: ValueFromNumberMetric(metric, stubDataObject)
                });
            }
        }

        chartData.series.push({
            name: l_name,
            data: values
        });
    });

    return (
        <Chart
            options={chartData.options}
            series={chartData.series}
            className="graphChart"
            key={props.isPreview ? UUID() : metric.id /* Updates Every Time Only If We Are In Preview Mode*/}
            type={"area"}
            width={310}
            height={140}
        />
    )
}
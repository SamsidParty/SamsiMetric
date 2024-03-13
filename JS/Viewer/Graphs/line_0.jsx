function Graphline_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    //Check If Self Or Any Dependencies Have Snaphots
    var hasSnapshots = SnapshotAt(metric.id, Infinity) != null;
    var tree = ShakeDependencyTree(metric, DataObject);
    tree.forEach((l_dep) => {
        if (SnapshotAt(l_dep, Infinity) != null) {
            hasSnapshots = true;
        }
    });

    return (
        <div style={props.style} className={"layoutCard graphLine0 " + props.cardSize}>
            <GraphCommon {...props} />

            {(() => {
                if (!hasSnapshots) {
                    //No Snapshots Available
                    return (<i className="ti ti-hourglass-empty"></i>);
                }
                else if (window.ReactApexChart == undefined) {
                    //Still Loading
                    return (<></>);
                }
                else {
                    //Render The Graph
                    return (<Graphline_0_Line {...props} />);
                }
            })()}
        </div>
    )
}

function Graphline_0_Line(props) {

    var [timeRangeIndex, setTimeRangeIndex] = React.useState(props.graph.timeRange || 0);

    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, window.lastDataObject, { snapshotMode: true });

    //Time Ranges
    //0: Past Hour
    //1: Past 24 Hours
    //2: Past Week
    //3: Past Month
    //4: Past Year

    var unixSeconds = Math.floor(Date.now() / 1000);

    var timeRanges = [
        {
            name: "1H",
            fullName: "Past Hour",
            unix: [unixSeconds - 3600, unixSeconds],
            detail: 240
        },
        {
            name: "24H",
            fullName: "Past 24 Hours",
            unix: [unixSeconds - 86400, unixSeconds],
            detail: 240
        },
        {
            name: "7D",
            fullName: "Past Week",
            unix: [unixSeconds - 604800, unixSeconds],
            detail: 240
        },
        {
            name: "30D",
            fullName: "Past Month",
            unix: [unixSeconds - 2592000, unixSeconds],
            detail: 240
        },        
        {
            name: "1Y",
            fullName: "Past Year",
            unix: [unixSeconds - 31536000, unixSeconds],
            detail: 365
        },
    ]

    var timeRange = timeRanges[timeRangeIndex];

    var [isDataLoaded, setIsDataLoaded] = React.useState(false);

    setTimeout(async () => {
        if (!isDataLoaded) {
            await LoadSnapshotRange(timeRange.unix[0],timeRange.unix[1]);
            setIsDataLoaded(true);
        }
    }, 0);


    var names = chartFill[1];
    var dates = [];
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
            tooltip: {
                theme: document.body.classList.contains("dark") ? "dark" : "light",
                x: {
                    formatter: (value) => { return dates[value] }
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
                curve: "monotoneCubic",
                lineCap: "round"
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
    names.forEach((l_name, l_index) => {
        var values = [];

        for (let i = 0; i < timeRange.detail; i++) {
            var timeOfSnap = Math.ceil(timeRange.unix[0] + ((Math.abs(timeRange.unix[0] - timeRange.unix[1]) / timeRange.detail) * (i + 1)));
            var snap = SnapshotAt(metric.id, timeOfSnap);
            var stubDataObject = { data: {} };

            if (snap && snap.SnapData) {
                stubDataObject.data[SnapshotTables[metric.type]] = JSON.parse(snap.SnapData);
                values.push(ValueFromNumberMetric(metric, stubDataObject));
                dates.push(new Date(snap.SnapTime * 1000).toLocaleString());
            }
        }

        chartData.series.push({
            name: l_name,
            data: values
        });
    });

    return (
        <>
            <div className="cardActionRow" style={{ backgroundColor: "var(--col-bg)", zIndex: "10" }}>
                <Dropdown>
                    <Dropdown.Button size="xs" auto light>{timeRange.name}</Dropdown.Button>
                    <Dropdown.Menu onAction={setTimeRangeIndex}>
                        {
                            timeRanges.map((l_range, l_index) => {
                                return (<Dropdown.Item key={l_index}>{l_range.fullName}</Dropdown.Item>);
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <Chart
                options={chartData.options}
                series={chartData.series}
                className="graphChart"
                key={UUID() /* Updates Every Render */}
                type={"area"}
                width={310}
                height={140}
            />
        </>

    )
}

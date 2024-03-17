function Graphline_0(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    //The ChartJS Graph Takes A Long Time To Init, And Therefore Freezes For A Bit
    //So We Will Mount The ChartJS Graph After Everything Else Has Rendered For Better UX
    var [mountDelay, setMountDelay] = React.useState(true);
    React.useEffect(() => setMountDelay(false));

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
                if (!hasSnapshots || !window.ChartJS || mountDelay) {
                    //No Snapshots Available
                    //Or Chart.JS Hasn't Loaded
                    return (<GraphLoading {...props}></GraphLoading>);
                }
                else if (window.ChartJS == undefined) {
                    //Still Loading
                    return (<></>);
                }
                else {
                    //Render The Graph
                    return (<Graphline_0_Line key={props.isPreview ? UUID() : metric.id /* Updates Every Time Only If We Are In Preview Mode*/} {...props} />);
                }
            })()}
        </div>
    )
}

function Graphline_0_Line(props) {

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var [timeRangeIndex, setTimeRangeIndex] = React.useState(props.graph.timeRange || 0);

    var metrics = CurrentProject(window.lastDataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);

    var chartFill = FillChart(metric, window.lastDataObject, { snapshotMode: true });

    var refreshGraph = () => {
        chartData.shouldRefresh = true;
        setChartData(Object.assign({}, chartData));
    }

    //Time Ranges
    //0: Past Hour
    //1: Past 24 Hours
    //2: Past Week
    //3: Past Month
    //4: Past Year

    var unixSeconds = DataObject.syncTime;

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

    var loadTimeRange = (l_index) => {
        timeRange = timeRanges[l_index];
        if (!IsRangeLoaded(timeRange.unix)) {
            setIsDataLoaded(false);
        }
        props.graph.timeRange = l_index;
        setTimeRangeIndex(l_index);
        refreshGraph();
    }

    var [isDataLoaded, setIsDataLoaded] = React.useState(IsRangeLoaded(timeRange.unix));

    setTimeout(async () => {
        if (!isDataLoaded) {
            await LoadSnapshotRange(timeRange.unix[0], timeRange.unix[1]);
            setIsDataLoaded(true);
        }
    }, 0);


    var names = chartFill[1];
    var colors = chartFill[2];
    var metricDatas = chartFill[5];
    var dates = [];

    var defaultChartData = {
        labels: [],
        datasets: [],
        options: {
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
                    color: 'black',
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                },
                line: {
                    tension: 0.4
                }
            },
            hover: {
                mode: 'index',
                intersect: false
            },
            layout: {
                padding: {
                    top: 10
                }
            },
            maintainAspectRatio: false,
            datasetStrokeWidth: 3
        },
        shouldRefresh: true,
        key: "default"
    }

    var [chartData, setChartData] = React.useState(defaultChartData);

    React.useEffect(() => {
        async function _() {
            if (chartData.shouldRefresh && isDataLoaded) {
                //Add Series Data To The Chart
                names.forEach((l_name, l_index) => {
                    var values = [];
    
                    for (let i = 0; i < timeRange.detail; i++) {
                        var timeOfSnap = Math.ceil(timeRange.unix[0] + ((Math.abs(timeRange.unix[0] - timeRange.unix[1]) / timeRange.detail) * (i + 1)));
                        var snap = SnapshotAt(metricDatas[l_index].id, timeOfSnap);
                        var stubDataObject = { data: {} };
    
                        if (snap && snap.SnapData) {
                            stubDataObject.data[SnapshotTables[metricDatas[l_index].type]] = JSON.parse(snap.SnapData);
                            var value = ValueFromNumberMetric(metricDatas[l_index], stubDataObject);
    
                            values.push(value);
    
                            dates.push(new Date(snap.SnapTime * 1000).toLocaleString());
                        }
    
                        if (l_index == 0) {
                            var timeOfAxis = (timeRange.unix[0] + ((i + 1) / timeRange.detail) * (timeRange.unix[1] - timeRange.unix[0]));
                            defaultChartData.labels.push(timeOfAxis);
                        }
                    }
    
                    //Enable Line Smoothing
                    if (props.graph.lineSmoothing) {
                        var nullDupes = data => data.map((x, i) => data[i - 1] === x ? null : x);
                        var lastValidValue = values[values.length - 1];
                        values = nullDupes(values);
                        values[defaultChartData.labels.length - 1] = lastValidValue;
                    }
    
                    defaultChartData.datasets.push({
                        data: values,
                        label: l_name,
                        backgroundColor: (context) => {
                            const ctx = context.chart.ctx;
                            const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.offsetHeight);
                            gradient.addColorStop(0, tagColors[metricDatas[l_index].tag] + "41");
                            gradient.addColorStop(1, tagColors[metricDatas[l_index].tag] + "00");
                            return gradient;
                        },
                        fill: true,
                        borderColor: tagColors[metricDatas[l_index].tag],
                        spanGaps: true,
                    });
                });
                defaultChartData.key = UUID();
                defaultChartData.shouldRefresh = false;
                setChartData(Object.assign({}, defaultChartData));
            }
        }
        _();
    });

    return (
        <>
            <GraphLoadingOverlay {...props} hide={isDataLoaded} />
            <div className="cardActionRow" style={{ backgroundColor: "var(--col-bg)", zIndex: "10" }}>
                <Dropdown>
                    <Dropdown.Button size="xs" auto light>{timeRange.name}</Dropdown.Button>
                    <Dropdown.Menu onAction={loadTimeRange}>
                        {
                            timeRanges.map((l_range, l_index) => {
                                return (<Dropdown.Item key={l_index}>{l_range.fullName}</Dropdown.Item>);
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
            </div>
            <h3 className="metricName">{metric.name}</h3>
            <ChartJSLine key={chartData.key} options={chartData.options} data={chartData} style={{ marginTop: "40px" }}>

            </ChartJSLine>
        </>

    )
}

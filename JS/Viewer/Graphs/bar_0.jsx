function Graphbar_0(props) {

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
        <div style={props.style} className={"layoutCard graphBar0 " + props.cardSize}>
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
                    return (<Graphbar_0_Bar key={props.isPreview ? UUID() : metric.id /* Updates Every Time Only If We Are In Preview Mode*/} {...props} />);
                }
            })()}
        </div>
    )
}

function Graphbar_0_Bar(props) {

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
            detail: 6,
            label: (t, i) => i == 5 ? "Now" : (5 - i) + "0M Ago"
        },
        {
            name: "24H",
            fullName: "Past 24 Hours",
            unix: [unixSeconds - 86400, unixSeconds],
            detail: 12,
            label: (t, i) => {
                var d = (new Date());
                d.setHours(d.getHours() - ((11 - i) * 2));
                d.setMinutes(0, 0, 0);
                return Intl.DateTimeFormat('default',{ hour12: true, hour: 'numeric', minute: 'numeric' }).format(d);
            }
        },
        {
            name: "7D",
            fullName: "Past Week",
            unix: [unixSeconds - 604800, unixSeconds],
            detail: 7,
            label: (t, i) => {
                var d = (new Date());
                d.setDate(d.getDate() - (6 - i));
                return Intl.DateTimeFormat('default',{ weekday: 'short' }).format(d);
            }
        },
        {
            name: "30D",
            fullName: "Past Month",
            unix: [unixSeconds - 2592000, unixSeconds],
            detail: 15,
            label: (t, i) => {
                var d = (new Date());
                d.setDate(d.getDate() - ((14 - i) * 2));
                return d.getDate();
            }
        },
        {
            name: "1Y",
            fullName: "Past Year",
            unix: [unixSeconds - 31536000, unixSeconds],
            detail: 12,
            label: (t, i) => {
                var d = (new Date());
                d.setMonth(d.getMonth() - (11 - i));
                return Intl.DateTimeFormat('default',{ month: 'short' }).format(d);
            }
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
                    color: 'transparent',
                }
            },
            scales: {
                x: {
                    stacked: true,
                    display: props.cardSize == "csLongDouble" // Only Show Axis On Large Graph
                },
                y: {
                    stacked: true,
                    display: props.cardSize == "csLongDouble"
                }
            },
            layout: {
                padding: {
                    top: 10,
                    left: props.cardSize == "csLongDouble" ? 10 : 0, // Only Add Padding If The Graph Is Large Enough
                    right: props.cardSize == "csLongDouble" ? 10 : 0,
                    bottom: props.cardSize == "csLongDouble" ? 10 : 0,
                }
            },
            maintainAspectRatio: false,
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
                            defaultChartData.labels.push(timeRange.label(timeOfAxis, i));
                        }
                    }

                    defaultChartData.datasets.push({
                        data: values,
                        label: l_name,
                        backgroundColor: tagColors[metricDatas[l_index].tag],
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
            <ChartJSBar key={chartData.key} options={chartData.options} data={chartData} style={{ marginTop: "40px" }}>

            </ChartJSBar>
        </>

    )
}

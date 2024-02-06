function Graphmap_0(props)
{
    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    
    var metrics = CurrentProject(DataObject)["metrics"];
    var metric = ArrayValue(metrics, "id", props.graph["for"]);
    var eligibleSubmetrics = []; // Group Mode Only

    //Handle Differently If The Metric Is A Group
    if (metric.type == "group") {
        metric.dependencies.forEach((l_dep) => {
            var dep = ArrayValue(CurrentProject(DataObject).metrics, "id", l_dep);
            if (dep.type == "country") {
                eligibleSubmetrics.push(dep);
            }
        });
        var [selectedMetric, setSelectedMetric] = React.useState(eligibleSubmetrics[0]); 
    }

    return (
        <div style={props.style} className={"layoutCard graphMap0 " + props.cardSize}>
            <GraphCommon {...props} />
            {
                //Render The Map Only If React Simple Maps Is Loaded
                window.ReactSimpleMaps != undefined ?
                Graphmap_0_Map({...props, metric: selectedMetric || metric}) :
                (<></>)
            }
            {
                //Render Group Header Or Standalone Header
                selectedMetric ?
                Graphmap_0_GroupHeader({...props, metric: metric, selectedMetric: selectedMetric, setSelectedMetric: setSelectedMetric, eligibleSubmetrics: eligibleSubmetrics}) :
                Graphmap_0_Header({...props, metric: selectedMetric || metric})
            }

        </div>
    )
}

//Header For Standalone Metric
function Graphmap_0_Header(props) 
{
    return (
        <div className="mapHeader">
            <div className="metricIcon" style={{ backgroundColor: tagColors[props.metric.tag] }}>
                <CachedIcon src={props.metric.icon} />
            </div>
            <h3 className="boldText">{props.metric.name}</h3>
        </div>
    )
}

//Header For Multiple Country Metrics In A Group
function Graphmap_0_GroupHeader(props) 
{

    var setSelected = (sel) => {
        var metric = ArrayValue(CurrentProject(window.lastDataObject).metrics, "id", sel.currentKey);
        props.setSelectedMetric(metric);
    }

    return (
        <div className="mapHeader mapGroupHeader">
            <div className="metricIcon" style={{ backgroundColor: tagColors[props.selectedMetric.tag] }}>
                <CachedIcon src={props.selectedMetric.icon} />
            </div>
            <Dropdown color={props.metric.tag}>
                <Dropdown.Button auto light css={{ tt: "capitalize" }}>
                    {props.selectedMetric.name}
                </Dropdown.Button>
                <Dropdown.Menu
                    disallowEmptySelection
                    selectionMode="single"
                    onSelectionChange={setSelected}
                >
                    {
                        props.eligibleSubmetrics.map((l_dep) => {
                            return (<Dropdown.Item key={l_dep.id}>{l_dep.name}</Dropdown.Item>);
                        })
                    }
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

function Graphmap_0_Map(props)
{

    var metric = props.metric;
    var highestValue = 0.01; // Prevents Divide By 0

    //Find Highest Value
    if (metric) {
        for (let i = 0; i < listOfCountries.length; i++) {
            var value = ValueFromNumberMetric(metric, window.lastDataObject, "Country" + listOfCountries[i].alpha2.toUpperCase());
    
            if (value > highestValue) {
                highestValue = value;
            }
        }
    }


    var interpolateColor = (c0, c1, f) => {
        c0 = c0.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * (1-f))
        c1 = c1.match(/.{1,2}/g).map((oct)=>parseInt(oct, 16) * f)
        let ci = [0,1,2].map(i => Math.min(Math.round(c0[i]+c1[i]), 255))
        return ci.reduce((a,v) => ((a << 8) + v), 0).toString(16).padStart(6, "0")
    }

    var getCountry2Digit = (country) => {
        if (!metric) { return 0; }

        for (let i = 0; i < listOfCountries.length; i++) {
            if (listOfCountries[i].alpha3.toUpperCase() == country.toUpperCase()) {
                return listOfCountries[i].alpha2.toUpperCase();
            }
        }

        return "GB";
    }

    var getCountryInfo = (country) => {
        if (!metric) { return 0; }

        var alpha2 = getCountry2Digit(country);
        for (let i = 0; i < listOfCountries.length; i++) {
            if (listOfCountries[i].alpha2.toUpperCase() == alpha2.toUpperCase()) {
                return listOfCountries[i];
            }
        }
    }

    var getCountryValue = (country) => {
        if (!metric) { return 0; }

        for (let i = 0; i < listOfCountries.length; i++) {
            if (listOfCountries[i].alpha3.toUpperCase() == country.toUpperCase()) {
                var value = ValueFromNumberMetric(metric, window.lastDataObject, "Country" + listOfCountries[i].alpha2.toUpperCase());
                return value != undefined ? value : 0;
            }
        }

        return 0;
    }

    var getCountryColor = (country) => {
        if (!metric) { return "#fdd8e5"; }

        var value = getCountryValue(country);
        value = (value / highestValue);
        var startingColor = getComputedStyle(document.body).getPropertyValue(`--nextui-colors-${metric.tag}Light`).replace("#", "");
        return "#" + interpolateColor(startingColor, tagColors[metric.tag].replace("#", ""), value);
    }


    var hoverCountry = (e) => {
        window.lastTTText = tooltipTemplates["graphmetric"].content([getCountryInfo(e).name, getCountryValue(e).toString()]);
        window.lastTTKey = props.graphNonce;
        window.lastTTPlacement = "bottom";
    }

    var unHoverCountry = (e) => {
        if (window.lastTTKey == props.graphNonce) {
            window.lastTTText = "";
            window.lastTTKey = "";
        }
    }

    return (
        <>
            <ReactSimpleMaps.ComposableMap
                width={640}
                height={310}
                projection="geoMercator"
                outline="none"
                projectionConfig={{
                    center: [5, 20],
                    scale: 95,
                }}
            >
                <ReactSimpleMaps.Geographies geography={window.WorldGeoJSON}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <ReactSimpleMaps.Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={getCountryColor(geo.id)}
                                outline="none"
                                onMouseEnter={() => hoverCountry(geo.id)}
                                onMouseLeave={() => unHoverCountry(geo.id)}
                                stroke="transparent"
                                strokeWidth={0}
                            />
                        ))
                    }
                </ReactSimpleMaps.Geographies>
            </ReactSimpleMaps.ComposableMap>
        </>
    );
}
//Full Layout Functions Are Not Loaded On Mobile
var DummyLayout = () => {};

var LayoutTypes = [
    {
        "name": "layout_1",
        "render": () => Layout_1,
        "height": 140,
        "graphcount": 4,
        "graphorder": ["csMedLong", "csMedLong", "csMedLong", "csMedLong"]
    },
    {
        "name": "layout_2",
        "render": () => Layout_2,
        "height": 70,
        "graphcount": 4,
        "graphorder": ["csShortLong", "csShortLong", "csShortLong", "csShortLong"]
    },
    {
        "name": "layout_3",
        "render": () => Layout_3,
        "height": 300,
        "graphcount": 2,
        "graphorder": ["csLongDouble", "csLongDouble"]
    },
    {
        "name": "layout_4",
        "render": () => Layout_4,
        "height": 300,
        "graphcount": 5,
        "graphorder": ["csLongDouble", "csMedLong", "csMedLong", "csMedLong", "csMedLong"]
    },    
    {
        "name": "layout_5",
        "render": () => Layout_5,
        "height": 300,
        "graphcount": 5,
        "graphorder": ["csMedLong", "csMedLong", "csMedLong", "csMedLong", "csLongDouble"]
    }
]

//Used In Scaling Calculations On Mobile
var GraphWidths = {
    "csMedLong": 310,
    "csShortLong": 310,
    "csLongDouble": 640
}

var GraphHeights = {
    "csMedLong": 140,
    "csShortLong": 70,
    "csLongDouble": 310
}

//Used In The Graph Creation Screen
var GraphTypes = [
    {
        "native": "true",
        "name": "num_0",
        "for": ["average", "total", "country"],
        "size": ["csMedLong", "csShortLong"],
        "render": () => Graphnum_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
            {
                "type": "bool",
                "displayname": "Display Unit As Prefix",
                "name": "prefixunit",
                "default": false
            }
        ]
    },
    {
        "native": "true",
        "name": "line_0",
        "for": ["snapshot", "total", "average", "country", "group"],
        "size": ["csMedLong", "csLongDouble"],
        "render": () => Graphline_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
            {
                "type": "bool",
                "displayname": "Line Smoothing",
                "name": "lineSmoothing",
                "default": true
            }
        ],
        "dependencies": [
            "./JS/ThirdParty/chart.js"
        ]
    },
    {
        "native": "true",
        "name": "bar_0",
        "for": ["snapshot", "total", "average", "country", "group"],
        "size": ["csMedLong", "csLongDouble"],
        "render": () => Graphbar_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
        ],
        "dependencies": [
            "./JS/ThirdParty/chart.js"
        ]
    },
    {
        "native": "true",
        "name": "table_0",
        "for": ["group", "country"],
        "size": ["csLongDouble"],
        "render": () => Graphtable_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
            {
                "type": "select",
                "displayname": "Sorting",
                "name": "sorting",
                "default": 0,
                "options": [
                    "None - Best Performance",
                    "Value - High To Low",
                    "Value - Low To High",
                    "Alphabetical - A To Z",
                    "Alphabetical - Z To A"
                ]
            },
            {
                "type": "bool",
                "displayname": "Hide Empty Rows",
                "name": "hidenullrows",
                "default": true
            }
        ],
        "dependencies": [
            "./JS/ThirdParty/countries.js" // Only Needed For Country Table But No Harm In Loading It Anyways
        ]
    },
    {
        "native": "true",
        "name": "pie_0",
        "for": ["group"],
        "size": ["csMedLong"],
        "render": () => Graphpie_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
            {
                "type": "bool",
                "displayname": "Hollow",
                "name": "hollow",
                "default": false
            },
            {
                "type": "bool",
                "displayname": "Show Icon",
                "name": "showicon",
                "default": true
            }
        ],
        "dependencies": [
            "./JS/ThirdParty/apexcharts.js"
        ]
    },
    {
        "native": "true",
        "name": "progress_0",
        "for": ["group"],
        "size": ["csMedLong", "csShortLong"],
        "render": () => Graphprogress_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": []
    },
    {
        "native": "true",
        "name": "map_0",
        "for": ["country", "group"],
        "size": ["csLongDouble"],
        "render": () => Graphmap_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
        ],
        "dependencies": [
            "./JS/ThirdParty/countries.js",
            "./JS/ThirdParty/reactsimplemaps.js"
        ]
    }
]

function GetMetadataFromGraph(graph) {
    return ArrayValue(GraphTypes, "name", graph.type);
}

function GetMetadataFromLayout(layout) {
    return ArrayValue(LayoutTypes, "name", layout.type);
}
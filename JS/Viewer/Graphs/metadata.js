//Full Layout Functions Are Not Loaded On Mobile
var DummyLayout = () => {};

var WorkspaceLayouts = {
    "layout_1": window.isDesktop ? layout_1 : DummyLayout,
    "layout_2": window.isDesktop ? layout_2 : DummyLayout,
    "layout_3": window.isDesktop ? layout_3 : DummyLayout,
};

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
        "name": "table_0",
        "for": ["group"],
        "size": ["csLongDouble"],
        "render": () => Graphtable_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": []
    },
    {
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
        "name": "progress_0",
        "for": ["group"],
        "size": ["csMedLong", "csShortLong"],
        "render": () => Graphprogress_0,
        "settingsui": (props) => graphsettings_standard(props),
        "settings": [
        ]
    },
    {
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

window.lastTTOX = -1;
window.lastTTOY = -1;

var tooltipTemplates = {
    favicon: {
        content: () => `${window.ProductName} ${latestVersion}`,
        placement: "bottomRight"
    },
    static: {
        content: (param) => param,
        placement: "bottom"
    },
    graphmetric: {
        content: (param) => `${param[0]}: ${param[1].toLocaleString("en-US")}`,
        placement: "bottom"
    }
}

function UpdateTT(e) {

    //Use Event Position Or Last Event Position If Event Is Null
    var offsetX = e != undefined ? e.clientX : window.lastTTX;
    var offsetY = e != undefined ? e.clientY : window.lastTTY;
    window.lastTTX = offsetX;
    window.lastTTY = offsetY;

    var text = window.lastTTText || "";
    TTBody.innerText = text;

    var placementOffset = 15;
    var placement = window.lastTTPlacement || "bottom";

    if (placement == "bottomRight") {
        offsetX += placementOffset;
        offsetY += placementOffset;
    }
    else if (placement == "bottomLeft") {
        offsetX -= placementOffset;
        offsetY += placementOffset;
    }
    else if (placement == "bottom") {
        var width = getComputedStyle(TTBody).width;
        offsetX -= (width.includes("px") ? (parseInt(width.toString().replace("px", "")) / 2) : 0);
        offsetY += placementOffset;
    }

    if (window.lastTTOX >= 0) {
        TTBody.style.left = `${window.lastTTOX}px`;
        TTBody.style.top = `${window.lastTTOY}px`;
    }
    else {
        TTBody.style.left = `${offsetX}px`;
        TTBody.style.top = `${offsetY}px`;
    }


    //Set Visibility Based On Body Class
    if (document.body.classList.contains("hideTooltips") || text == "") {
        TTBody.style.display = "none";
    }
    else {
        TTBody.style.display = "flex";
    }
}

function TTContent(target, param) {
    var props = {
        enterDelay: 0,
        color: "invert",
        shadow: false
    };
    
    props = {...props, ...tooltipTemplates[target]};
    props.content = props.content(param); // Evaluate Content As Function

    return props;
}

//Tooltip That Doesn't Affect Layout (Should Be Child Of Target)
function Tooltip(props) {

    var child = React.Children.only(props.children);

    if (!props.ttid) {
        console.error("Tooltip Must Have ttid Set");
    }

    var mouseEnter = (e) => {
        window.lastTTText = props.content;
        window.lastTTKey = props.ttid;
        window.lastTTPlacement = props.placement;
    }

    var mouseLeave = (e) => {
        if (window.lastTTKey == props.ttid) {
            window.lastTTText = "";
            window.lastTTKey = "";
        }
    }

    return (
        <React.Fragment>
            { React.cloneElement( props.children, { onMouseEnter: mouseEnter, onMouseLeave: mouseLeave } ) }
        </React.Fragment>
    )
}

window.addEventListener("keydown", (e) => {
    if (e.key == "Shift") {
        if (document.body.classList.contains("hideTooltips")) {
            document.body.classList.remove("hideTooltips");
            UpdateTT();
            setTimeout(UpdateTT, 0);
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.key == "Shift") {
        if (!document.body.classList.contains("hideTooltips")) {
            document.body.classList.add("hideTooltips");
            UpdateTT();
            setTimeout(UpdateTT, 0);
        }
    }
});

//Make Tooltip Invisible Initially
if (!document.body.classList.contains("hideTooltips")) {
    document.body.classList.add("hideTooltips");
}

//Create Tooltip
var TTBody = document.createElement("div");
TTBody.id = "mastertooltip";
document.body.appendChild(TTBody);
TTBody = document.getElementById("mastertooltip");
window.addEventListener("mousemove", UpdateTT);
setTimeout(UpdateTT, 0);
setInterval(UpdateTT, 100);
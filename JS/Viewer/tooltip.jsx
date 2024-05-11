
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
    },
    lockworkspace: {
        content: () => !!window.workspaceEditMode ? "Lock Workspace" : "Unlock Workspace",
        placement: "bottom"
    }
}

function UpdateTT(e) {

    //Use Event Position Or Last Event Position If Event Is Null
    var placeX = !!e ? e.clientX : window.lastTTX;
    var placeY = !!e ? e.clientY : window.lastTTY;

    var offsetX = 0;
    var offsetY = 0;

    if (!!e && isMobile && e.touches?.length > 0) {
        placeX = e.touches[0].clientX;
        placeY = e.touches[0].clientY;
    }

    window.lastTTX = placeX;
    window.lastTTY = placeY;

    var text = window.lastTTText || "";
    TTBody.innerText = text;

    var placementOffset = 15;
    var placement = window.lastTTPlacement || "bottom";

    //Calculate Width After The Tooltip Has Rendered
    setTimeout(() => {

        var ttWidth = TTBody.getBoundingClientRect().width;


        if (placement == "bottomRight") {
            offsetX += placementOffset;
            offsetY += placementOffset;
        }
        else if (placement == "bottomLeft") {
            offsetX -= placementOffset;
            offsetY += placementOffset;
        }
        else if (placement == "bottom") {
            offsetX -= ttWidth / 2;
            offsetY += placementOffset;
        }

        //Fingers Get In The Way, Move It Up
        if (isMobile) {
            offsetY = -100;
        }
    
        if (window.lastTTOX >= 0) {
            TTBody.style.left = `${window.lastTTOX + offsetX}px`;
            TTBody.style.top = `${window.lastTTOY + offsetY}px`;
        }
        else {
            TTBody.style.left = `${placeX + offsetX}px`;
            TTBody.style.top = `${placeY + offsetY}px`;
        }

    }, 0);


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
        if (isMobile) {
            UpdateTT();
        }
        else {
            window.lastTTText = props.content;
            window.lastTTKey = props.ttid;
            window.lastTTPlacement = props.placement;
        }
    }

    var mouseLeave = (e) => {
        if (isMobile) {
            UpdateTT();
        }
        else {
            if (window.lastTTKey == props.ttid) {
                window.lastTTText = "";
                window.lastTTKey = "";
            }
        }
    }

    return (
        <React.Fragment>
            { React.cloneElement( props.children, { onMouseEnter: mouseEnter, onMouseLeave: mouseLeave, onTouchStart: mouseEnter, onTouchEnd: mouseLeave, "aria-label": props.content } ) }
        </React.Fragment>
    )
}

window.addEventListener("keydown", (e) => {
    if (isDesktop && e.key == "Shift") {
        ShowTooltips();
    }
});

window.addEventListener("keyup", (e) => {
    if (isDesktop && e.key == "Shift") {
        HideTooltips();
    }
});

window.addEventListener("touchstart", (e) => {
    ShowTooltips();
});

window.addEventListener("touchend", (e) => {
    HideTooltips();
});

function ShowTooltips() {
    if (document.body.classList.contains("hideTooltips")) {
        document.body.classList.remove("hideTooltips");
        UpdateTT();
        setTimeout(UpdateTT, 0);
    }
}

function HideTooltips() {
    if (!document.body.classList.contains("hideTooltips")) {
        document.body.classList.add("hideTooltips");
        UpdateTT();
        setTimeout(UpdateTT, 0);
    }
}

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
window.addEventListener("touchmove", UpdateTT);
setTimeout(UpdateTT, 0);
setInterval(UpdateTT, 100);
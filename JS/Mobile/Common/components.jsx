var NativeComponentQueue = [];


function NativeButton(props) {

    var width = props.width || "75vw";
    var height = props.height || "6.5vh";
    var divRef = React.useRef(null);

    var [componentID, setComponentID] = React.useState(UUID());

    React.useEffect(() => {
        if (divRef.current) {
            NativeComponentQueue.push({
                id: componentID,
                type: "Button",
                width: divRef.current.getBoundingClientRect().width,
                height: divRef.current.getBoundingClientRect().height,
                top: divRef.current.getBoundingClientRect().top,
                left: divRef.current.getBoundingClientRect().left,
                background: props.background || false,
                text: props.children.toString(),
            });
        }
    }, []);

    return (
        <div ref={divRef} className="nativeButton" style={{ width: width, height: height }}>

        </div>
    )

}
AutoLoadThisFile();

function DeleteButton(props) {

    var [isOpen, setIsOpen] = React.useState(false);

    function startDelete() {
        setIsOpen(true);
    }

    function finishDelete() {
        props.onDelete();
        setIsOpen(false)
    }

    return (
        <>
            <Button flat color={props.color || "error"} auto className="iconButtonLarge deleteButton" onPress={startDelete}><i className="ti ti-trash"></i></Button>
            <Modal width="420px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Confirm Delete
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ textAlign: "center" }}>
                        This Change Can Be Reverted By Pressing The 'Discard' Button.
                    </p>
                    <div className="flexx fillx facenter fjcenter gap10">
                        <Button flat color="error" onPress={() => { setIsOpen(false); }}>Cancel</Button>
                        <Button color="error" onPress={finishDelete}>Delete</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

//1x1 PNG Transparent
var LoadingStub = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

function ClientImage(props) {

    var image = React.useRef(0);

    var trySettingImage = () => {
        setTimeout(() => {
            if (loadedBinaryDependencies[props.src] != undefined) {
                if (image.current) {
                    image.current.src = loadedBinaryDependencies[props.src];
                }
            }
            else {
                trySettingImage();
            }
        }, 0);
    }

    setTimeout(async () => {
        if (loadedBinaryDependencies[props.src] == undefined && busy == 0) {
            await LoadDependency(props.src);
        }

        trySettingImage();
    }, 0);
    

    return (
        <img ref={image} {...props} src={LoadingStub} />
    )
}

var IconCache = {};

function CachedIcon(props) {

    var [iconURL, setIconURL] = React.useState((IconCache[props.src] != undefined) ? IconCache[props.src] : LoadingStub);

    if (props.src.startsWith("data:image/")) {
        useFirstRender(); // Fix "Rendered Fewer Hooks Than Expected"
        return (
            <img {...props} src={props.src} />
        );
    }

    if (useFirstRender() && IconCache[props.src] == undefined) {
        setTimeout(async () => {
            localforage.getItem("IconCache/" + props.src, async (err, value) => {
                if (value == null) {
                    var liveImage = await ConvertBlob(await (await fetch(`./UploadedIcons/${props.src}`)).blob());
                    await localforage.setItem("IconCache/" + props.src, liveImage);
                }
    
                var cachedImage = await localforage.getItem("IconCache/" + props.src);
                IconCache[props.src] = cachedImage;
                setIconURL(cachedImage);
            });
        }, 0);
    }

    return (
        <img {...props} src={iconURL} />
    )
}
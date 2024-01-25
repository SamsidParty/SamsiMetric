
//Create File Input And Mount It To The DOM
var IconUploader = document.createElement("input");
IconUploader.type = "file";
IconUploader.accept = ".png,.jpg,.jpeg";
IconUploader.style.display = "none";
IconUploader.id = "iconuploader";
IconUploader.onchange = OnIconUploaded;
document.body.appendChild(IconUploader);
IconUploader = document.getElementById("iconuploader");
var IconUploadResult = null;

function IconSelect(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;
    var [isOpen, setIsOpen] = React.useState(false);
    var [filterText, setFilterText] = React.useState("");
    var [loadAmount, setLoadAmount] = React.useState(117);

    var currentlyLoaded = 0;

    var openEditor = async () =>
    {
        if (!window.tablerIconDatabase)
        {
            await LoadDependency("./JS/ThirdParty/tablericons.js");
        }

        setIsOpen(true);
    }

    //Returns True If The Icon Should Be Shown
    var filter = (l_icon) =>
    {
        if (filterText == "") { return true; }

        if (l_icon.name.toLowerCase().includes(filterText.toLowerCase())) { return true; }
        if (JSON.stringify(l_icon.tags).toLowerCase().includes(filterText.toLowerCase())) { return true; } // No Point Iterating When This Is Simpler

        return false;
    }

    //Load More Icons When Scrolled To Bottom
    var checkEnd = (e) =>
    {
        if (e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight < 1)
        {
            setLoadAmount(Math.min(loadAmount + 117, 5000)); //Tabler Only Has Around 5000 Icons So No Need To Load More
        }
    }

    var applyIcon = async (e) =>
    {
        var svgData = e.svg;
        var pngData = await GetIconAsPNG(svgData, 0, "transparent");
        props.onSelected(pngData);
        setDataObject(Object.assign({}, DataObject));
        setIsOpen(false);
    }

    var iconsAvailable = [];
    if (window.tablerIconDatabase)
    {
        iconsAvailable = window.tablerIconDatabase;
    }

    return (
        <>
            <Button flat auto className="iconButtonLarge" onPress={openEditor}><i className="ti ti-color-swatch"></i></Button>
            <Modal width="900px" closeButton open={isOpen} onClose={() => { setIsOpen(false); }}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        <Input onChange={(e) => { setFilterText(e.target.value); setLoadAmount(127); }} width="850px" bordered placeholder="Search Icons From tabler-icons.io" />
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <div className="iconSelect" onScroll={checkEnd}>
                        {
                            iconsAvailable.map((l_icon) =>
                            {
                                //We Don't Want A Lawsuit For Trademark Infringement
                                //Being Sued Is Very Unlikely But Better Safe Than Sorry
                                //If You Really Want Brand Icons Then Set localStorage.exp_enableBrandIcons to true
                                if (((!l_icon.name.startsWith("brand") && l_icon.category != "Brand") || localStorage.exp_enableBrandIcons == "true") && filter(l_icon) && currentlyLoaded < loadAmount)
                                {
                                    currentlyLoaded++;
                                    return (<Button key={l_icon.name} onPress={() => applyIcon(l_icon)} auto className="iconButtonLarge"><i className={`ti ti-${l_icon.name}`}></i></Button>);
                                }
                            })
                        }
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

async function UploadIconFile() {
    IconUploadResult = null;
    IconUploader.click();
    await WaitUntil(() => (IconUploadResult != null));
    return IconUploadResult;
}

async function OnIconUploaded() {
    if (IconUploader.files && IconUploader.files.length > 0)
    {
        var reader = new FileReader();
        reader.onload = function (e)
        {
            var img = document.createElement("img");
            img.onload = function (event)
            {

                var canvas = document.createElement("canvas");
                canvas.width = 240;
                canvas.height = 240;

                var width = img.width;
                var height = img.height;

                if (width > height)
                {
                    if (width > 240)
                    {
                        height = height * (240 / width);
                        width = 240;
                    }
                } else
                {
                    if (height > 240)
                    {
                        width = width * (240 / height);
                        height = 240;
                    }
                }

                var ctx = canvas.getContext("2d");
                ctx.mozImageSmoothingEnabled = false;
                ctx.webkitImageSmoothingEnabled = false;
                ctx.msImageSmoothingEnabled = false;
                ctx.imageSmoothingEnabled = false;
                ctx.drawImage(img, (240 - width) / 2, (240 - height) / 2, width, height);
                var dataurl = canvas.toDataURL("image/png");
                IconUploadResult = dataurl;
            }
            img.src = e.target.result;
        }
        reader.readAsDataURL(IconUploader.files[0]);
    }
}
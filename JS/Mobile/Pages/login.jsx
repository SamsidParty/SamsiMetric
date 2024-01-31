
function Login() {

    //Whether The Continue Button Is Disabled
    var [ loginDisabled, setLoginDisabled ] = React.useState(false);
    var [ loginText, setLoginText ] = React.useState("Continue");
    var [ loginStage, setLoginStage ] = React.useState([".mobileLoginWelcomeScreen"]);

    var pageContents = {
        ".mobileLoginWelcomeScreen": () => LoginWelcomeStage,
        ".mobileLoginInputServerScreen": () => LoginInputServerStage
    }

    var loginChangeStage = (from, to) => {
        var screen = document.querySelector(from);

        if (screen.classList.contains("pageIn")) {
            screen.classList.remove("pageIn");
        }

        screen.classList.add("pageOut");

        setTimeout(() => { 
            setLoginStage([to]);
        }, 400);
    }

    document.body.style.overflow = "hidden";
    var LoginStageContent = pageContents[loginStage]();

    return (
        <>  
            {pageContents[loginStage]()(loginChangeStage)}
        </>
    )
}

function LoginWelcomeStage(loginChangeStage) {

    return (
        <>
                       { /* ↓↓↓↓↓↓ Makes Sure That Classes Are Reset Every Render  */ }
            <div className={UUID() + " loginScreen pageIn mobileLoginWelcomeScreen"}>
                <div className="topLogin">
                    <h4 className="largeIcon">{ isApple ? "\udbc2\udeac" : "\ueb1f" }</h4>
                    <h3>Connect To A<br/> SamsiMetric Server</h3>
                    <p>Connect And Authenticate With A SamsiMetric Instance Of Your Choice</p>
                </div>
                <div className="bottomLogin">
                    <NativeButton onPress={() => loginChangeStage(".mobileLoginWelcomeScreen", ".mobileLoginInputServerScreen")}>Continue</NativeButton>
                </div>

            </div>
        </>
    )
}

function LoginInputServerStage(loginChangeStage) {

    return (
        <>
                       { /* ↓↓↓↓↓↓ Makes Sure That Classes Are Reset Every Render  */ }
            <div className={UUID() + " loginScreen pageIn mobileLoginInputServerScreen"}>
                <div className="topLogin">
                    <h4 className="largeIcon">{ isApple ? "\udbc2\udeac" : "\ueb1f" }</h4>
                    <h3>Let's Get Setup</h3>
                    <p>Enter The Web Address Of The Server To Connect To</p>
                </div>
                <div className="bottomLogin">
                    <NativeButton disabled={true} onPress={null}>Continue</NativeButton>
                </div>

            </div>
        </>
    )
}


async function AskForAPIKey() {
    var keyPrompt = await prompt({
        title: "API Key Required",
        subtitle: "Please Enter Your API Key To Authenticate With " + window.ProductName,
        buttons: [
            {
                text: "Cancel",
                value: "cancel",
                style: 'cancel'
            },
            {
                text: "Confirm",
                value: "confirm",
                style: 'ok'
            }
        ],
        options: {
            type: "plain-text",
            cancelable: false,
            defaultValue: "",
            placeholder: "placeholder"
        }
    });

    return keyPrompt;
}
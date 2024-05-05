
var SetupReasons = {
    "database": SetupDatabase,
    "format": SetupFormatDatabase,
    "formatcomplete": SetupFormatComplete,
    "formatfailed": SetupFormatFailed,
}

function SetupDatabase() {
    return (
        <>
            <h2>Couldn't Connect To The Database</h2>
            <h4>Please ensure that the proper environment variables are valid on the server:<br></br>
            - DB_HOST: The Address Of The MySQL Database<br></br>
            - DB_USERNAME: The Username Used To Connect To The Database<br></br>
            - DB_PASSWORD: The Password For The Databse, In Plain Text<br></br>
            - DB_ANALYTICS: The Name Of The Database Used For {ProductName}</h4>
            <Button size="lg" auto color="error" onClick={() => window.location.href = "./Dashboard"}><i className="ti ti-reload"></i> &nbsp; Try Again</Button>
        </>
    )
}

function SetupFormatDatabase() {
    return (
        <>
            <h1>Database Format Required</h1>
            <h4>The MySQL Database Needs To Be Setup To Work With {ProductName}<br></br>
            It Is Highly Recommended That This Action Is Performed On An Empty Database<br></br>
            This CANNOT BE UNDONE</h4>
            <Button size="lg" auto color="error" onClick={() => window.location.href = "./Setup?reason=formatcomplete"}><i className="ti ti-eraser"></i> &nbsp; Format Database</Button>
        </>
    )
}

function SetupFormatComplete() {
    return (
        <>
            <h1>Database Format Complete</h1>
            <h4>You're Good To Go</h4>
            <Button size="lg" auto color="primary" onClick={() => window.location.href = "./Dashboard"}>Continue&nbsp;<i className="ti ti-arrow-right"></i></Button>
        </>
    )
}

function SetupFormatFailed() {
    return (
        <>
            <h1>Database Format Failed</h1>
            <h4>Something Went Wrong, No Further Information Is Available</h4>
            <Button size="lg" auto color="primary" onClick={() => window.location.href = "./Dashboard"}><i className="ti ti-reload"></i> &nbsp; Try Again</Button>
        </>
    )
}

function SetupModal()
{
    //The Reason Why The User Was Redirected To The Setup Page
    var reason = (new URL(window.location.href)).searchParams.get("reason");

    return (
        <ClientImage background="true" className="setupPage" src="./Images/BackgroundDecoration.jpg">
            <div className="setupContainer">
                <div className="setupModal">
                    {SetupReasons[reason]()}
                    
                </div>
            </div>
        </ClientImage>
    );
}

function Setup()
{
    return (
        <NextUI.NextUIProvider theme={theme}>
            <SetupModal></SetupModal>
        </NextUI.NextUIProvider>
    );
}

var SetupReasons = {
    "database": SetupDatabase
}

function SetupDatabase() {
    return (
        <>
            <h1>Couldn't Connect To The Database</h1>
            <h4>Please ensure that the proper environment variables are valid on the server:</h4>
            <h4>- DB_HOST: The Address Of The MySQL Database</h4>
            <h4>- DB_USERNAME: The Username Used To Connect To The Database</h4>
            <h4>- DB_PASSWORD: The Password For The Databse, In Plain Text</h4>
            <h4>- DB_ANALYTICS: The Name Of The Database Used For {ProductName}</h4>
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
                    <Button size="lg" auto color="primary" onClick={() => window.location.href = "./Dashboard"}>Try Again</Button>
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
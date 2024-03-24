
function SetupModal()
{
    



    return (
        <ClientImage background="true" className="setupPage" src="./Images/BackgroundDecoration.jpg">
            <div className="setupContainer">
                <div className="setupModal">

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
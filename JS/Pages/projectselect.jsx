
function ProjectSelectModal()
{
    return (
        <ClientImage background="true" className="setupPage" src="./Images/BackgroundDecoration.jpg">
            <div className="setupContainer">
                <div className="setupModal">
                    <h1>Select Project</h1>
                </div>
            </div>
        </ClientImage>
    );
}

function ProjectSelect()
{
    return (
        <NextUI.NextUIProvider theme={theme}>
            <ProjectSelectModal></ProjectSelectModal>
        </NextUI.NextUIProvider>
    );
}
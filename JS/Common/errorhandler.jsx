//Error Boundaries Don't Work With Functional Programming
class MetricErrorBoundary extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = { error: ""};
    }

    componentDidCatch(error)
    {
        this.setState({ error: `${error.name}: ${error.message}` });
    }

    render()
    {
        const { error } = this.state;
        if (error)
        {
            return (
                <div style={this.props.style} className={"layoutCard graphError0 " + this.props.cardSize}>
                    <GraphCommon {...this.props} />
                    <i className="ti ti-alert-triangle"></i>
                </div>
            );
        } else
        {
            return <>{this.props.children}</>;
        }
    }
}

//A component that displays an error if SamsiMetric won't work
function BasicPageChecks() {
    return (
        <>
            {
                //Ignore Secure Context On LAN
                (!window.isSecureContext && !window.location.host.startsWith("192.168")) ?
                <UnskippableError error="SamsiMetric Requires A Secure Context To Operate. Some Browser Features Are Unavailable When Using HTTP And Analytics Are Sensitive Information."></UnskippableError> : null
            }
        </>
    )
}

function UnskippableError(props) {
    return (
        <>
            <Modal preventClose width="420px" open={true}>
                <Modal.Header>
                    <Text b id="modal-title" size={20}>
                        Critical Error
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <p style={{ textAlign: "center" }}>
                        {props.error}
                    </p>
                    <div style={{ color: "crimson" }} className="flexx fillx facenter fjcenter gap10">
                        SamsiMetric Cannot Continue Operation, You Won't Be Able To Use It Unless You Fix The Above Error(s).
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
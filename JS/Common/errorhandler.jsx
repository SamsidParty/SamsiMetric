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
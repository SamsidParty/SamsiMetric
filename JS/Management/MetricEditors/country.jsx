function MetricEdit_country(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <>
            <MetricEdit_common metric={props.metric} exampleName="eg: Users By Country" ></MetricEdit_common>
            <MetricEdit_common_num isInt={true} {...props} />
        </>
    )
}
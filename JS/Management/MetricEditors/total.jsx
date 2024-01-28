function MetricEdit_total(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <>
            <MetricEdit_common metric={props.metric} exampleName="eg: Total User Count" ></MetricEdit_common>
            <MetricEdit_common_num {...props} />
        </>
    )
}
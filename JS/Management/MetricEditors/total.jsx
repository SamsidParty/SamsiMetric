function MetricEdit_total(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    return (
        <>
            <MetricEdit_common metric={props.metric} exampleName="eg: Total Sales" ></MetricEdit_common>
            <MetricEdit_common_num {...props} />
        </>
    )
}
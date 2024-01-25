
function MetricEdit_average(props)
{

    var { DataObject, setDataObject } = React.useContext(DataContext); window.lastDataObject = DataObject;

    var setRounding = (e) =>
    {
        var DataObject = extDataObject;
        var metric = ArrayValue(CurrentProject(DataObject).metrics, "id", props.metric.id);
        metric["rounding"] = parseInt(e);
        setExtDataObject(Object.assign({}, DataObject));
    }

    return (
        <>
            <MetricEdit_common metric={props.metric} exampleName="eg: Average Money Spent" ></MetricEdit_common>
            <MetricEdit_common_num {...props} />
        </>
    )
}
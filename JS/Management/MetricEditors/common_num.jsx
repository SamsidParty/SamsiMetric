function MetricEdit_common_num(props)
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
            <Input bordered label="Unit" data-key={props.metric.id + "/unit"} onChange={MetricDataChanged_input} placeholder="eg: USD" initialValue={props.metric["unit"]} />
            <label style={{ fontSize: "14px", marginBottom: "2px", marginLeft: "4px", display: props.isInt ? "none" : "block" }} className="nextui-input-block-label">Accuracy</label>
            <Radio.Group
                style={{ marginLeft: "4px" }}
                orientation="horizontal"
                value={props.metric["rounding"].toString()}
                onChange={setRounding}
                css={props.isInt ? { display: "none" } : {}}
                size="sm"
            >
                <Radio value="0">3</Radio>
                <Radio value="1">3.1</Radio>
                <Radio value="2">3.14</Radio>
                <Radio value="3">3.141</Radio>
                <Radio value="4">3.1415</Radio>
            </Radio.Group>
            <NextUI.Spacer y={1} />
        </>
    )

}
RunOnLoad("./JS/Management/common.jsx", async () => {
    await LoadDependency("./JS/Management/iconmanager.jsx");
    await LoadDependency("./JS/Management/projectmanager.jsx");
    await LoadDependency("./JS/Management/workspacemanager.jsx");
});


function ColorBar(props)
{

    var [value, setValue] = React.useState(props.value);

    var textContent = (e) =>
    {

        if (value == e)
        {
            return (<i className="ti ti-point-filled"></i>);
        }

        return (<i className="ti ti-point"></i>);
    }

    var changeClicked = (e) =>
    {
        setValue(e.target.name);
        e.target.value = e.target.name;
        e.target.setAttribute("data-key", props["data-key"]);

        if (props.onChange)
        {
            props.onChange(e);
        }

    }

    return (
        <div value={value}>
            <div className="horizontalButtons">
                <Button onPress={changeClicked} auto name="success" color="success">{textContent("success")}</Button>
                <Button onPress={changeClicked} auto name="primary" color="primary">{textContent("primary")}</Button>
                <Button onPress={changeClicked} auto name="secondary" color="secondary">{textContent("secondary")}</Button>
                <Button onPress={changeClicked} auto name="warning" color="warning">{textContent("warning")}</Button>
                <Button onPress={changeClicked} auto name="error" color="error">{textContent("error")}</Button>
            </div>
        </div>
    )
}
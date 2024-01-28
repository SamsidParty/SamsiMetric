<?php

if (!isset($virtualAPI)) {
    $virtualAPI = array(
        "server" => $_SERVER,
        "input" => file_get_contents("php://input")
    );
}

require_once("./PHP/config.php");
require_once("./PHP/auth.php");
header("Content-Type: application/json");

if ($virtualAPI["server"]["HTTP_X_MODE"] == "ControlPanel")
{

    ViewerOnly();

    $params = json_decode($virtualAPI["server"]["HTTP_X_PARAMS"], true);

    if ($params != null && array_key_exists("action", $params)) {
        //Sanitize And Run Action
        $action = $params["action"];

        if (preg_match("/[^a-zA-Z0-9_]/", $action)) 
        {
            http_response_code(400);
            die('[{"type":"error","error":"Invalid Input"}]');
        }
        Sanitize($action);
        require("./PHP/Actions/" . $action . ".php");
    }

}
else if ($virtualAPI["server"]["HTTP_X_MODE"] == "Submit") 
{

    CollectorOnly();

    $projects = json_decode(GetConfigFile('projects.json'), true);
    $params = json_decode($virtualAPI["input"], true);
    $foundMetric = false;

    foreach ($projects as $proj) 
    {
        foreach ($proj["metrics"] as $metric) 
        {
            if ($metric["id"] == $params["id"]) 
            {
                $foundMetric = true;
                break;
            }
        }
    }

    if (!$foundMetric)
    {
        http_response_code(404);
        die('[{"type":"error","error":"Metric Was Not Found"}]');
    }

    if (preg_match("/[^a-zA-Z0-9_]/", $metric["type"])) {
        http_response_code(400);
        die('[{"type":"error","error":"Invalid Metric"}]');
    }

    Sanitize($metric["type"]);
    require("./PHP/MetricWriters/" . $metric["type"] . ".php");

}
else 
{
    die('[{"type":"error","error":"X-Mode Should Be Submit Or ControlPanel"}]');
}


?>
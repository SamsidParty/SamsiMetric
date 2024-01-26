<?php

//REMOVE, JUST FOR TESTING SKELETON
sleep(5);

if (!isset($virtualAPI)) {
    $virtualAPI = array(
        "server" => $_SERVER,
        "input" => file_get_contents("php://input")
    );
}

require_once("./PHP/config.php");
header("Content-Type: application/json");

function CollectorOnly() 
{
    global $currentKey;

    if ($currentKey["perms"] != "collector") {
        die('[{"type":"error","error":"This API Key Was Issued For A Different Purpose"}]');
    }
}

function ViewerOnly() 
{
    global $currentKey;

    if ($currentKey["perms"] != "admin" && $currentKey["perms"] != "manager" && $currentKey["perms"] != "viewer") {
        die('[{"type":"error","error":"The API Key Was Issued For A Different Purpose"}]');
    }
}

function ManagerOnly() 
{
    global $currentKey;

    if ($currentKey["perms"] != "manager" && $currentKey["perms"] != "admin") {
        die('[{"type":"error","error":"The API Key Was Issued For A Different Purpose"}]');
    }
}

function AdminOnly() 
{
    global $currentKey;

    if ($currentKey["perms"] != "admin") {
        die('[{"type":"error","error":"The API Key Was Issued For A Different Purpose"}]');
    }
}

function Sanitize(string $input) {
    if (preg_match("/[^a-zA-Z0-9_]/", $input)) {
        http_response_code(400);
        die('[{"type":"error","error":"Malformed Input"}]');
    }
}

if ($virtualAPI["server"]["HTTP_X_MODE"] == "ControlPanel" || $virtualAPI["server"]["HTTP_X_MODE"] == "Submit") 
{
    //Check API Key
    $auth = $virtualAPI["server"]["HTTP_X_API_KEY"];
    $keys = json_decode(GetConfigFile("keys.json"), true);

    //Enabled Admin Perms Temporarily For All Keys (Only Works In Source)
    if (file_exists("./.build")) {
        $keys = array(0 => (array("value" => "build", "id" => "build", "name" => "build", "perms" => "admin")));
    }

    $currentKey = null;

    foreach ($keys as $key) 
    {
        if (password_verify($auth, $key["value"]))
        {
            $currentKey = $key;
            break;
        }
    }

    if ($currentKey == null) 
    {
        http_response_code(401);
        die('[{"type":"error","error":"The API Key Is Invalid Or Was Revoked"}]');
    }
}

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
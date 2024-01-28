<?php 

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
?>
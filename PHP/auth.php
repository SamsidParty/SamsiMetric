<?php 

require_once("./PHP/sql.php");

if ($virtualAPI["server"]["HTTP_X_MODE"] == "ControlPanel" || $virtualAPI["server"]["HTTP_X_MODE"] == "Submit") 
{
    //Check API Key
    $clientKey = $virtualAPI["server"]["HTTP_X_API_KEY"];
    $serverKeys = json_decode(GetConfigFile("keys.json"), true);
    $sessionBased = str_starts_with($clientKey, "Bearer ");

    //Enabled Admin Perms Temporarily For All Keys (Only Works In Source)
    if (file_exists("./.build")) {
        $serverKeys = array(0 => (array("value" => "build", "id" => "build", "name" => "build", "perms" => "admin")));
    }

    $currentKey = null;

    if ($sessionBased) {
        //Check Against Session Tokens
        $query = DB::query("SELECT * FROM sessions WHERE Token = %s;", $clientKey);
        if ($query[0]["Token"] == $clientKey) {
            $clientKey = $query[0]["KeyID"];
        }
    }
    
    //Check Against API Keys
    foreach ($serverKeys as $serverKey) 
    {
        if (($sessionBased && $clientKey == $serverKey["id"]) || password_verify($clientKey, $serverKey["value"]))
        {
            $currentKey = $serverKey;
            break;
        }
    }

    //Reject If 2FA Is Required
    //TODO: Implement 2FA
    if (isset($currentKey["twofa"]) && !$sessionBased) {
        http_response_code(424);
        die('[{"type":"error","error":"2-Factor Authentication Code Invalid"}]');
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
        http_response_code(403);
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
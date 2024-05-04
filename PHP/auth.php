<?php 

require_once("./PHP/sql.php");

if ($virtualAPI["server"]["HTTP_X_MODE"] == "ControlPanel" || $virtualAPI["server"]["HTTP_X_MODE"] == "Submit") 
{
    //Check API Key
    $originalClientKey = $virtualAPI["server"]["HTTP_X_API_KEY"];
    $clientKey = $virtualAPI["server"]["HTTP_X_API_KEY"];
    $serverKeys = json_decode(GetConfigFile("keys.json"), true);
    $sessionBased = str_starts_with($clientKey, "Bearer ");

    //Enabled Admin Perms Temporarily For All Keys (Only Works In Source)
    if (file_exists("./.build")) {
        $serverKeys = array(0 => (array("value" => '$2y$10$jnpqFE05BxYeB9h93ht97unngllyGOsELwH8X.J73EK01Hwlrf.OS', "id" => "build", "name" => "build", "perms" => "admin")));
    }

    $currentKey = null;

    if ($sessionBased) {
        //Check Against Session Tokens
        $query = DB::query("SELECT * FROM sessions WHERE Token = %s LIMIT 1;", $clientKey);
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

    //Reject If 2FA Is Wrong
    if (isset($currentKey["twofa"]) && !$sessionBased) {
        require_once("./PHP/2fa.php");

        $correctCode = (new Totp())->GenerateToken(Base32::decode($currentKey["twofa"]));
        if (!isset($virtualAPI["server"]["HTTP_X_2FA"]) || $virtualAPI["server"]["HTTP_X_2FA"] != $correctCode) {
            http_response_code(424);
            die('[{"type":"error","error":"2-Factor Authentication Code Invalid"}]');
        }
    }

    if ($currentKey == null) 
    {
        http_response_code(401);
        die('[{"type":"error","error":"Session Has Expired Or Incorrect Credentials"}]');
    }

    DB::query("UPDATE sessions SET LastAccess = UNIX_TIMESTAMP() WHERE Token = %s LIMIT 1;", $originalClientKey);

    ScrubUnusedSessions();
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

function ScrubUnusedSessions() {
    $threshold = time() - 604800; // 1 Week Ago
    DB::query("DELETE FROM sessions WHERE LastAccess < %i AND Permanent = 0;", $threshold);
}
?>
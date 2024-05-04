<?php

require_once("./PHP/sql.php");
$responseCurrentKey = $currentKey;

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'PATCH') {
    //Replace The Keys File (Admin Only)

    $newKeys = $virtualAPI["input"];

    AdminOnly();
    SetConfigFile("keys.json", $newKeys); // Validation Is Client Side, If It Messes Up, Then Someone Made A Bad Request
    $response = array(
        array(
            "type" => "key_info",
            "method" => "patch",
            "key_info" => json_decode($newKeys, true)
        )
    );
}
else if ($virtualAPI["server"]['REQUEST_METHOD'] == 'POST') {
    //Create New Session
    $token = "Bearer " . bin2hex(random_bytes(16));
    DB::query("INSERT INTO sessions (Token, KeyID, Identity, LastAccess) VALUES (%s, %s, %s, UNIX_TIMESTAMP())", $token, $currentKey["id"], $virtualAPI["server"]["REMOTE_ADDR"]);

    $responseCurrentKey["value"] = $token;

    //Return Info On Current Key
    $response = array(
        array(
            "type" => "key_info",
            "key_info" => $responseCurrentKey
        )
    );
}
else {


    if (array_key_exists("all", $params) && $params["all"] == "true") {
        //Return Info On ALL Keys (Admin Only)
        AdminOnly();
        $response = array(
            array(
                "type" => "key_info",
                "all" => "true",
                "key_info" => $serverKeys
            )
        );
    }
    else {
        //Return Info On Current Key
        $response = array(
            array(
                "type" => "key_info",
                "key_info" => $responseCurrentKey
            )
        );
    }
}


echo json_encode($response);

?>
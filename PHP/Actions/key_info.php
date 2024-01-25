<?php

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
else {
    if (array_key_exists("all", $params) && $params["all"] == "true") {
        //Return Info On ALL Keys (Admin Only)
        AdminOnly();
        $response = array(
            array(
                "type" => "key_info",
                "all" => "true",
                "key_info" => $keys
            )
        );
    }
    else {
        //Return Info On Current Key
        $response = array(
            array(
                "type" => "key_info",
                "key_info" => $currentKey
            )
        );
    }
}


echo json_encode($response);

?>
<?php

require_once("./PHP/sql.php");

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'POST') {
    //Create Or Patch Multiple Icons (Admin Only)

    ManagerOnly();

    $iconData = json_decode($virtualAPI["input"], true);

    foreach ($iconData as $icon) 
    {
        if (strlen($icon["value"]) > 1048576 /* 1MB */ ) {
            http_response_code(400);
            die('[{"type":"error","error":"Image Too Large (1MB Limit)"}]');
        }

        Sanitize($icon["id"]);

        DB::insert('icons', [
            'IconID' => $icon["id"],
            'IconData' => base64_decode($icon["value"]),
        ]);
    }

    $response = array(
        array(
            "type" => "upload_icon",
            "method" => "post"
        )
    );
}
else {
    http_response_code(405);
    die('[{"type":"error","error":"Method Not Allowed"}]');
}

echo json_encode($response);

?>
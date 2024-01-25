<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    //Create Or Patch Multiple Icons (Admin Only)

    ManagerOnly();

    $iconData = json_decode(file_get_contents('php://input'), true);

    foreach ($iconData as $icon) 
    {
        if (strlen($icon["value"]) > 1048576 /* 8MB */ ) {
            http_response_code(400);
            die('[{"type":"error","error":"Image Too Large (8MB Limit)"}]');
        }

        Sanitize($icon["id"]);

        file_put_contents("./UploadedIcons/" . $icon["id"] . ".png", base64_decode($icon["value"]));
    }

    $response = array(
        array(
            "type" => "upload_icon",
            "method" => "post",
            "stored_icons" => glob("./UploadedIcons/*.png")
        )
    );
}
else {
    http_response_code(405);
    die('[{"type":"error","error":"Method Not Allowed"}]');
}

echo json_encode($response);

?>
<?php 

AdminOnly();

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'POST') {
    $hashed = password_hash($virtualAPI["input"], PASSWORD_DEFAULT, ['cost' => 8]);
    
    $response = array(
        array(
            "type" => "key_hash",
            "key_hash" => $hashed
        )
    );
}
else {
    http_response_code(405);
    die('[{"type":"error","error":"Method Not Allowed"}]');
}


echo json_encode($response);

?>
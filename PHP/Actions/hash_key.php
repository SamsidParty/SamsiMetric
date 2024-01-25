<?php 

AdminOnly();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $hashed = password_hash(file_get_contents('php://input'), PASSWORD_DEFAULT, ['cost' => 8]);
    
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
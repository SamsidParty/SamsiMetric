<?php 

//Shorten Path To Parts We Need
$apiFullPath = explode("/", $_SERVER["REQUEST_URI"]);
$apiRelativePath = array();
$apiShouldPush = false;
foreach ($apiFullPath as $section) {
    if ($apiShouldPush) {
        array_push($apiRelativePath, $section);
    }
    if ($section == "API") {
        $apiShouldPush = true;
    }
}

chdir("../../");
$virtualServer = $_SERVER;
$virtualBody = file_get_contents("php://input");

$virtualServer["HTTP_X_MODE"] = "ControlPanel";
$virtualServer["HTTP_X_API_KEY"] = $_SERVER["HTTP_AUTHORIZATION"];

if ($apiRelativePath[0] == "submit") {
    $virtualServer["HTTP_X_MODE"] = "Submit";

    $vbody = array(
        "id" => $apiRelativePath[1],
        "data" => json_decode($virtualBody, true)
    );
}

$virtualAPI = array(
    "server" => $virtualServer,
    "input" => json_encode($vbody)
);

require("./backend.php");

?>
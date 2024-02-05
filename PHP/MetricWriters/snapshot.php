<?php

//Ignore If Sent From HTTP
//This File Is Designed To Be Run With A Cron Job
/*if (isset($currentKey)) {
    http_response_code(400);
    die();
}*/

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

//CD Into Analytics Root
chdir(dirname(__FILE__));
chdir(realpath("../../"));

require_once("./PHP/sql.php");
require_once("./PHP/config.php");

$projects = json_decode(GetConfigFile("projects.json"), true);
$log = "";

foreach ($projects as $project) {
    foreach ($project["metrics"] as $metric) {
        if ($metric["type"] == "snapshot") {
            $log .= $metric["name"] . "\n";
        }
        
    }
}

file_put_contents("/tmp/testcron.txt", $log);
echo $log;

?>
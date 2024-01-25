<?php 

require_once("./PHP/sql_dump.php");

$result = array("schema" => json_decode(GetConfigFile('projects.json')), "data" => DumpAsArray());

echo json_encode($result);

?>
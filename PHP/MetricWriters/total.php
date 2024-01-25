<?php 

require_once("./PHP/sql.php");

$newValue = $params["data"]["value"];

DB::query("UPDATE data_total SET ReportCount = ReportCount + 1 WHERE MetricID = %s", $metric["id"]); // Increment Reports
DB::query("UPDATE data_total SET Total = Total + %d WHERE MetricID = %s", $newValue, $metric["id"]); // Update Total

echo('[{"type":"success"}]');

?>
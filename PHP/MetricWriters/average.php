<?php 

require_once("./PHP/sql.php");

$newValue = $params["data"]["value"];

DB::query("UPDATE data_average SET ReportCount = ReportCount + 1 WHERE MetricID = %s", $metric["id"]); // Increment Reports

$currentAverage = (DB::query("SELECT Average, ReportCount FROM data_average WHERE MetricID = %s", $metric["id"]))[0]; // Get Current Average

$newAverage = $currentAverage["Average"] + (($newValue - $currentAverage["Average"]) / $currentAverage["ReportCount"]); // Calculate A New Average

DB::query("UPDATE data_average SET Average = %d WHERE MetricID = %s", $newAverage, $metric["id"]); // Update Average

echo('[{"type":"success"}]');

?>
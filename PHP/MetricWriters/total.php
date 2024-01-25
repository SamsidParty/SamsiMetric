<?php 

require_once("./PHP/sql.php");

try {
    $newValue = $params["data"]["value"];

    DB::query("UPDATE data_total SET ReportCount = ReportCount + 1 WHERE MetricID = %s", $metric["id"]); // Increment Reports
    DB::query("UPDATE data_total SET Total = Total + %d WHERE MetricID = %s", $newValue, $metric["id"]); // Update Total
    
    echo('[{"type":"success"}]');
}
catch (Exception $e)
{
    http_response_code(400);
    echo('[{"type":"error", "error": "Malformed Input"}]');
}


?>
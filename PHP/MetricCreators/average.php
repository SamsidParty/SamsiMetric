<?php 

require_once("./PHP/sql.php");

DB::query("INSERT INTO data_average (MetricID, ProjectID) VALUES (%s, %s)", $params["metric_id"], $params["project_id"]);

echo "{}";

?>
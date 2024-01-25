<?php 

require_once("./PHP/sql.php");

DB::query("DELETE FROM data_average WHERE MetricID = %s", $params["metric_id"]);

echo "{}";

?>
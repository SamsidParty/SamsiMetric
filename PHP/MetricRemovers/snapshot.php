<?php 

require_once("./PHP/sql.php");

DB::query("DELETE FROM snapshot_history WHERE MetricID = %s", $params["metric_id"]);

echo "{}";

?>
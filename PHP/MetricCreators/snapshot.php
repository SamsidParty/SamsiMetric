<?php

    require_once("./PHP/Actions/check_cron.php");
    require_once("./PHP/sql.php");    

    DB::query("INSERT INTO snapshot_history (MetricID) VALUES (%s)", $params["metric_id"]);

    echo "{}";

?>
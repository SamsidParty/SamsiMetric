<?php 

function GetMetricFromID($dataObject, $metricID) {

    foreach ($dataObject as $project) {
        foreach ($project["metrics"] as $metric) {
            if ($metric["id"] == $metricID) {
                return $metric;
            }
        }
    }

    return null;
}

function DumpMetric($metric) {
    if ($metric["type"] == "total") {
        $query = DB::query("SELECT * FROM data_total WHERE MetricID = %s", $metric["id"]);
    }
    else if ($metric["type"] == "average") {
        $query = DB::query("SELECT * FROM data_average WHERE MetricID = %s", $metric["id"]);
    }
    else if ($metric["type"] == "country") {
        $query = DB::query("SELECT * FROM data_country WHERE MetricID = %s", $metric["id"]);
    }

    $json = json_encode($query);
    $gz = gzcompress($json, 4);

    return $gz;
}

?>
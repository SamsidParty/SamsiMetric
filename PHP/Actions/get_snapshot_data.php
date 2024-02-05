<?php

ViewerOnly();

$result = array();
$tdata = DB::query("SELECT * FROM data_snapshot WHERE SnapTime BETWEEN %d AND %d", $params["date_start"], $params["date_end"]);
$result["data_snapshot"] = $tdata;

for ($i = 0; $i < sizeof($result["data_snapshot"]); $i++) {
    $result["data_snapshot"][$i]["SnapData"] = base64_encode($result["data_snapshot"][$i]["SnapData"]);
}

echo json_encode($result);

?>
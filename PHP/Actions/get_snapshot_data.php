<?php

require_once("./PHP/ThirdParty/vendor/autoload.php");

ViewerOnly();

ini_set('memory_limit', '-1');

if (isset($params["get_data_directly"]) && $params["get_data_directly"] == "true") {
    //Send The Data
    $snapdata = DB::query("SELECT SnapData FROM data_snapshot WHERE SnapTime = %d AND MetricID = %s LIMIT 1", $params["snap_time"], $params["metric_id"]);
    echo $snapdata[0]["SnapData"];
}
else {
    //Send The MetaData
    $result = array();
    $tdata = DB::query("SELECT MetricID, SnapTime FROM data_snapshot WHERE SnapTime BETWEEN %d AND %d", $params["date_start"], $params["date_end"]);
    $result["data_snapshot"] = $tdata;

    $packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
    echo $packer->pack($result);
}



?>
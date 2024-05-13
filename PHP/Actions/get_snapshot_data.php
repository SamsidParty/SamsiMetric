<?php

require_once("./PHP/ThirdParty/vendor/autoload.php");

ViewerOnly();

ini_set('memory_limit', '-1');

if (isset($params["get_data_directly"]) && $params["get_data_directly"] == "true") {
    //Send The Data

    $where = new WhereClause('or');
    foreach (json_decode(file_get_contents("php://input"), true) as $snap) {
        $where->add("SnapIndex = %i", $snap["SnapIndex"]);
    }

    $query = DB::query("SELECT SnapData, SnapIndex FROM data_snapshot WHERE %l", $where);
    $snapDatas = array();

    foreach ($query as $snapData) {
        $snapDatas[(string)$snapData["SnapIndex"]] = new MessagePack\Type\Bin($snapData["SnapData"]);
    }

    $packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
    echo $packer->pack($snapDatas);
}
else {
    //Send The MetaData
    $result = array();
    $tdata = DB::query("SELECT MetricID, SnapTime, SnapIndex FROM data_snapshot WHERE SnapTime BETWEEN %d AND %d", $params["date_start"], $params["date_end"]);
    $result["data_snapshot"] = $tdata;

    $packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
    echo $packer->pack($result);
}



?>
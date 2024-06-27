<?php

require_once("./PHP/ThirdParty/vendor/autoload.php");

ViewerOnly();

ini_set('memory_limit', '-1');

$timeRange = json_decode($params["range"], true);

$where = new WhereClause('or');
for ($i = 0; $i < $timeRange["detail"]; $i++) {
    $timeOfSnap = ceil($timeRange["unix"][0] + ((abs($timeRange["unix"][0] - $timeRange["unix"][1]) / $timeRange["detail"]) * ($i + 1)));
    $timeOfSnap = round($timeOfSnap / 60) * 60; // Round To Nearest Minute
    $where->add("SnapTime = %i", $timeOfSnap);
}

$result = array();
$query = DB::query("SELECT * FROM data_snapshot WHERE %l", $where);
$result["data_snapshot"] = $query;

for ($i = 0; $i < sizeof($result["data_snapshot"]); $i++) {
    $result["data_snapshot"][$i]["SnapData"] = new MessagePack\Type\Bin($result["data_snapshot"][$i]["SnapData"]);
}

$packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
echo $packer->pack($result);



?>
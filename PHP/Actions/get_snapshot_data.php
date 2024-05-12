<?php

require_once("./PHP/ThirdParty/vendor/autoload.php");

ViewerOnly();

ini_set('memory_limit', '-1');

$result = array();
$tdata = DB::query("SELECT * FROM data_snapshot WHERE SnapTime BETWEEN %d AND %d", $params["date_start"], $params["date_end"]);
$result["data_snapshot"] = $tdata;

for ($i = 0; $i < sizeof($result["data_snapshot"]); $i++) {
    $result["data_snapshot"][$i]["SnapData"] = new MessagePack\Type\Bin($result["data_snapshot"][$i]["SnapData"]);
}
$packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
echo $packer->pack($result);

?>
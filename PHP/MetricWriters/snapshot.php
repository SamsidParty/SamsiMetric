<?php

//Ignore If Sent From HTTP
//This File Is Designed To Be Run With A Cron Job
/*if (isset($currentKey)) {
    http_response_code(400);
    die();
}*/

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

//CD Into Analytics Root
chdir(dirname(__FILE__));
chdir(realpath("../../"));

require_once("./PHP/sql.php");
require_once("./PHP/config.php");

$projects = json_decode(GetConfigFile("projects.json"), true);
$history = DB::query("SELECT * FROM snapshot_history");
$parsedHistory = array();

$time_minute = 60;
$time_10minute = 600;
$time_hour = 3600;
$time_day = 86400;

//Parse Snapshot History
foreach ($history as $metric) {
    $parsedHistory[$metric["MetricID"]] = intval($metric["LastSnap"]);
}

$log = json_encode($parsedHistory);

foreach ($projects as $project) {
    foreach ($project["metrics"] as $metric) {
        if ($metric["type"] == "snapshot") {
            $lastSnapshot = $parsedHistory[$metric["id"]];
            $timeDiff = time() - $lastSnapshot;

            
            if ($metric["rounding"] == 0) { //Every Minute
                $timeDiff -= $time_minute;
            }
            else if ($metric["rounding"] == 1) { //Every 10 Minutes
                $timeDiff -= $time_10minute;
            }
            else if ($metric["rounding"] == 2) { //Every Hour
                $timeDiff -= $time_hour;
            }
            else { //Every Day
                $timeDiff -= $time_day;
            }

            //Take Snapshot
            if ($timeDiff > 0) {
                //Add To Snapshot History
                DB::query("UPDATE snapshot_history SET LastSnap = %d WHERE MetricID = %s", time(), $metric["id"]);
            }

            $log .= $timeDiff . "\n";
        }
    }
}

file_put_contents("/tmp/testcron.txt", $log);
echo $log;

?>
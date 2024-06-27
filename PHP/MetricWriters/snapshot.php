<?php

//Ignore If Sent From HTTP
//This File Is Designed To Be Run With A Cron Job
if (isset($currentKey)) {
    http_response_code(400);
    die();
}

ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

//CD Into Analytics Root
chdir(dirname(__FILE__));
chdir(realpath("../../"));

require_once("./PHP/sql.php");
require_once("./PHP/metrics.php");
require_once("./PHP/config.php");
require_once("./PHP/pluginapi.php");
require_once("./PHP/ThirdParty/vendor/autoload.php");

class SnapshotWriter {

    public $projects;
    public $history;
    public $parsedHistory;
    public $metricsToSnapshot;
    
    const TIME_MINUTE = 60;
    const TIME_10MINUTE = 600;
    const TIME_HOUR = 3600;
    const TIME_DAY = 86400;

    function __construct() {
        $this->projects = json_decode(GetConfigFile("projects.json"), true);
        $this->history = DB::query("SELECT * FROM snapshot_history");
        $this->parsedHistory = array();
        $this->metricsToSnapshot = array();
    }

    function AddSubmetrics($projects, $metric, &$pushto) {
        foreach ($metric["dependencies"] as $l_dep) {
            $dep = GetMetricFromID($projects, $l_dep);
            if ($dep["type"] == "group") {
                $this->AddSubmetrics($projects, $dep, $pushto);
            }
            else {
                $pushto[] = $l_dep;
            }
        }
    }

    function TakeSnapshot($metric) {
        //Dump The Metric Into A Compressed Binary File Suitable For Long Term Storage
        $dump = DumpMetric($metric);
        DB::query("INSERT INTO data_snapshot (MetricID, SnapTime, SnapData) VALUES (%s, %d, %s)", $metric["id"], round(time() / 60) * 60, $dump);
    }

    function TakeAllSnapshots() {
        //Parse Snapshot History
        foreach ($this->history as $metric) {
            $this->parsedHistory[$metric["MetricID"]] = intval($metric["LastSnap"]);
        }

        foreach ($this->projects as $project) {
            foreach ($project["metrics"] as $metric) {
                if ($metric["type"] == "snapshot") {
                    $lastSnapshot = $this->parsedHistory[$metric["id"]];
                    $timeDiff = time() - $lastSnapshot;

                    
                    if ($metric["rounding"] == 0) { //Every Minute
                        $timeDiff -= self::TIME_MINUTE;
                    }
                    else if ($metric["rounding"] == 1) { //Every 10 Minutes
                        $timeDiff -= self::TIME_10MINUTE;
                    }
                    else if ($metric["rounding"] == 2) { //Every Hour
                        $timeDiff -= self::TIME_HOUR;
                    }
                    else { //Every Day
                        $timeDiff -= self::TIME_DAY;
                    }

                    //Update Snapshot Lists
                    if ($timeDiff >= 0) {
                        $this->AddSubmetrics($this->projects, $metric, $this->metricsToSnapshot);         

                        //Add To Snapshot History
                        DB::query("UPDATE snapshot_history SET LastSnap = %d WHERE MetricID = %s", time(), $metric["id"]);
                    }
                }
            }
        }

        //Take The Snapshots
        $this->metricsToSnapshot = array_unique($this->metricsToSnapshot); // No Need To Snapshot The Same Metric Multiple Times
        foreach ($this->metricsToSnapshot as $metricToSnapshot) {
            $this->TakeSnapshot(GetMetricFromID($this->projects, $metricToSnapshot));
        }
    }
}

$writer = new SnapshotWriter();
$writer->TakeAllSnapshots();

?>
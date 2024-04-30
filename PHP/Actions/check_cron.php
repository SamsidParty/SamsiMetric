<?php 

$cronvalid = file_exists("/etc/crontab") || (getenv("CONFIG_DISABLECRONCHECK") == "TRUE");

if (!$cronvalid) {
    http_response_code(500);
    die('[{"type":"error","error":"Cron Is Not Installed Or Is Not Available"}]');
}


$crontab = array();
exec("crontab -l", $crontab);
$hasJob = false;

//Check If Cron Job Already Exists
foreach ($crontab as $line) {
    if (str_contains($line, "PHP/MetricWriters/snapshot.php")) {
        $hasJob = true;
    }
}

//Don't Add The Job If It Exists Already
if (!$hasJob) {
    $php_path = PHP_BINDIR . '/php';
    $job = '* * * * * "' . $php_path . '" -q "' . realpath("./PHP/MetricWriters/snapshot.php") . "\"\n";
    $temp = tmpfile();
    $tempPath = stream_get_meta_data($temp)['uri'];

    //Invoke Crontab To Add Job
    fwrite($temp, $job);
    exec('crontab "' . $tempPath . '" 2>&1', $out);

    fclose($temp);
}

?>
<?php 

$cronvalid = file_exists("/etc/crontab");

if (!$cronvalid) {
    http_response_code(500);
    die('[{"type":"error","error":"Cron Is Not Installed Or Is Not Available"}]');
}

?>
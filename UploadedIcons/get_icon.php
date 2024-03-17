<?php 

header("Content-Type: image/png");
require_once("../PHP/sql.php");

$filename = pathinfo(basename(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH)), PATHINFO_FILENAME);
$iconQuery = DB::query("SELECT * FROM icons WHERE IconID=%s", $filename);

if (count($iconQuery) == 0) {
    echo file_get_contents("../Images/DefaultMetricIcon.png");
}
else {
    echo $iconQuery[0]["IconData"];
}

?>
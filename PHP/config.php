<?php

require_once("./PHP/sql.php");

function GetConfigFile($file) {
    $query = DB::query("SELECT * FROM config WHERE File = %s;", $file);
    return $query[0]["Content"];
}

function SetConfigFile($file, $content) {
    $query = DB::query("UPDATE config SET Content = %s WHERE File = %s;", $content, $file);
}

?>
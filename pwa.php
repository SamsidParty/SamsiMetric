<?php

require_once("./PHP/metadata.php");
header("Content-Type: application/json");

$pwa = [
    "lang" => "en-us", 
    "name" => $productName, 
    "short_name" => $productName, 
    "description" => "Analytics Client Powered By SamsiMetric", 
    "start_url" => dirname($_SERVER['SCRIPT_NAME']) . "/Dashboard", 
    "scope" => dirname($_SERVER['SCRIPT_NAME']) . "/", 
    "background_color" => "#ffffff", 
    "theme_color" => "#7a42ff", 
    "orientation" => "portrait", 
    "display" => "standalone", 
    "icons" => [
            [
                "src" => dirname($_SERVER['SCRIPT_NAME']) . "/Images/FullFavicon.png", 
                "sizes" => "512x512" 
            ] 
       ] 
]; 

echo json_encode($pwa);

?>
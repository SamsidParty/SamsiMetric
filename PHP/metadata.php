<?php 

    $productName = "SamsiMetric";
    $clientVersion = "dev00";
    $favicon = "<link rel='icon' type='image/png' href='./Images/SmallFavicon.png'>";
    $loader = "./JS/Common/loader.prod.js";

    if (file_exists("../.prod")) {
        $clientVersion = file_get_contents("../.prod");
    }
    if (str_contains($clientVersion, "dev")) {
        $loader = "./JS/Common/loader.dev.js";
    }
    if (file_exists("../.build")) {
        $clientVersion = file_get_contents("../.build");
    }
    
?>
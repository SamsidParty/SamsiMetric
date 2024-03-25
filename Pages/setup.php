<?php

//Enable Error Reporting
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

require("./common.php");

if (isset($_GET['reason']) && $_GET['reason'] == "formatcomplete") {
    //Actually Do The Format
    chdir("../");
    $data = file_get_contents("./Templates/SQL/initial.sql");
    $setupMode = true;
    require_once("./PHP/sql.php");
    DB::getMDB()->get()->multi_query($data);
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php echo $favicon; ?>
    <meta name="client-version" content="<?php echo $clientVersion; ?>">
    <meta name="product-name" content="<?php echo $productName; ?>">
    <meta name="dependencies" content="
        //Pages/common.jsx\
        //Pages/setup.jsx\
    ">
    <script src="<?php echo $loader; ?>" type="text/javascript"></script>
    <title><?php echo $productName; ?></title>
</head>
<body class="desktop" method="Setup">
    <div id="root"></div>
</body>
</html>
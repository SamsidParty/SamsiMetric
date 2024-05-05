<?php

//Enable Error Reporting
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

require_once("../PHP/metadata.php");

if (isset($_GET['reason']) && $_GET['reason'] == "formatcomplete") {
    //Actually Do The Format
    try {
        chdir("../");
        $data = file_get_contents("./Templates/SQL/initial.sql");
        $setupMode = true;
        require_once("./PHP/sql.php");

        $db = DB::getMDB()->get();
        $db->multi_query($data);
        
        do {
            $result = $db->use_result();
            if ($result) {
                $result->free();
            }
        } while ($db->next_result());
        $db->store_result();
        $db->commit();

        if (count(DB::query("SHOW TABLES LIKE 'config'")) < 1) {
            http_response_code(500);
            header("Location: ?reason=formatfailed");
            die();
        }

        http_response_code(201);
    }
    catch (Exception $ex) {
        http_response_code(500);
        header("Location: ?reason=formatfailed");
        die();
    }

}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require("./common.php") ?>
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
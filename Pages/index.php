<?php require("./common.php") ?>
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
        //Pages/main.jsx\
    ">
    <script src="<?php echo $loader; ?>" type="text/javascript"></script>
    <title><?php echo $productName; ?></title>
</head>
<body class="desktop" method="App">
    <div id="root"></div>
</body>
</html>
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
    <script src="./JS/Mobile/loader.js"></script>
    <title><?php echo $productName; ?></title>
</head>
<body class="mobile" method="App">
    <div id="root"></div>
    Syncing...
</body>
</html>
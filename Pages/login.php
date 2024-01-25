<!--

---- USING CUSTOM AUTHENTICATION ----
1. Redirect To Your Custom Auth Page
2. User Completes Custom Authentication
3. Custom Auth Redirects To This Page With URL Param ?key=
4. User Is Now Logged In

-->

<?php require("./common.php") ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <script> 
        var url = new URL(window.location.href);
        if (!url.searchParams.get("key")) {
            //Uncomment For Custom Authentication
            //window.location.href = ""; // Redirect To Your Custom Auth Page
        }
    </script>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php echo $favicon; ?>
    <meta name="client-version" content="<?php echo $clientVersion; ?>">
    <meta name="product-name" content="<?php echo $productName; ?>">
    <meta name="dependencies" content="
        //ThirdParty/react.dev.js\
        //Common/helper.js\
        //ThirdParty/nextui.js\
        //Pages/login.jsx\
    ">
    <script src="<?php echo $loader; ?>" type="text/javascript"></script>
    <title><?php echo $productName; ?></title>
</head>
<body class="desktop" method="Login">
    <div id="root"></div>
</body>
</html>
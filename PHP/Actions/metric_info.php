<?php

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'POST') {
    ManagerOnly();
    require("./PHP/MetricCreators/" . $params["type"] . ".php");
}
else if ($virtualAPI["server"]['REQUEST_METHOD'] == 'DELETE') {
    ManagerOnly();
    require("./PHP/MetricRemovers/" . $params["type"] . ".php");
}
else {
    http_response_code(405);
    die('[{"type":"error","error":"Method Not Allowed"}]');
}

?>
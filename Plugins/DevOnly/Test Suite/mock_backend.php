<?php

    $params = json_decode($_SERVER["HTTP_X_PARAMS"], true);

    //Enable Error Reporting
    ini_set('display_errors', '1');
    ini_set('display_startup_errors', '1');
    error_reporting(E_ALL);

    $mockData = [
        "schema" => [
            [
                "name" => "Test Dummy Project",
                "id" => "mock-project",
                "workspaceorder" => [
                    "mock-id-1",
                ],
                "workspaces" => [
                    [
                        "name" => "Test Dummy Workspace",
                        "id" =>
                            "mock-id-1",
                        "tag" => "primary",
                        "icon" => "default.png",
                        "layouts" => [
                            [
                                "type" => "layout_1",
                                "graphs" => [
                                    [
                                        "type" => "num_0",
                                        "for" => "457AB1-66F35C-CFAC2024",
                                        "prefixunit" => false,
                                    ],
                                    [],
                                    [],
                                    [],
                                ],
                            ],
                        ],
                    ],
                ],
                "metrics" => [
                    [
                        "id" => "457AB1-66F35C-CFAC2024",
                        "name" => "Test Dummy Metric",
                        "tag" => "warning",
                        "type" => "total",
                        "icon" => "default.png",
                        "rounding" => 2,
                        "dependencies" => [],
                    ],
                ],
            ],
        ],
        "data" => [
            "data_average" => [],
            "data_country" => [],
            "data_total" => [
                [
                    "Total" => "0",
                    "MetricID" => "457AB1-66F35C-CFAC2024",
                    "ProjectID" =>
                        "mock-project",
                    "ReportCount" => "0",
                ],
            ],
        ],
    ];

    if ($params["action"] == "get_data") {
        echo json_encode($mockData);
    }
    else if ($params["action"] == "get_snapshot_data") {
        header("Content-Type: application/msgpack");
        require_once("../../../PHP/ThirdParty/vendor/autoload.php");

        $result = array("data_snapshot" => array());

        ini_set('memory_limit', '-1');

        //Fill $result with 1 year's worth of random data
        $snapTime = time();

        for ($i = 0; $i < 525960; $i++) {
            $snapTime -= 60; // Minus One Minute

            $result["data_snapshot"][] = array(
                "MetricID" => "457AB1-66F35C-CFAC2024",
                "SnapTime" => $snapTime
            );
        }

        $packer = new MessagePack\Packer(MessagePack\PackOptions::FORCE_STR);
        echo $packer->pack($result);
    }
    else {

    }


?>
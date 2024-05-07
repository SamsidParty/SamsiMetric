<?php

    $params = json_decode($_SERVER["HTTP_X_PARAMS"], true);

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
        header("Content-Type: application/json");
        echo base64_decode("ga1kYXRhX3NuYXBzaG90kA"); // Empty Snapshot Data
    }
    else {

    }


?>
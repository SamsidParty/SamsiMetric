<?php

if ($_SERVER['REQUEST_METHOD'] == 'PATCH') {
    //Replace The Projects File (Admin Only)

    $newProjects = file_get_contents('php://input');

    ManagerOnly();
    SetConfigFile('projects.json', $newProjects); // Validation Is Client Side, If It Messes Up, Then Someone Made A Bad Request

    //Purge Unused Icons To Save Space
    //There's No Need To Traverse The JSON Tree, A Simple Contains Check Is Fine
    $projectData = GetConfigFile('projects.json');
    $allIcons = glob("./UploadedIcons/*.png");

    foreach ($allIcons as $storedIcon) {
        $iconName = pathinfo($storedIcon)["filename"];
        if (!str_contains($projectData, $iconName)){
            unlink($storedIcon); //Icon Is Not Needed
        }
    }

    $response = array(
        array(
            "type" => "project_info",
            "method" => "patch",
            "project_info" => json_decode($newProjects, true)
        )
    );
}
else {

    $response = array(
        array(
            "type" => "project_info",
            "project_info" => json_decode(GetConfigFile('projects.json'), true)
        )
    );
}

echo json_encode($response);

?>
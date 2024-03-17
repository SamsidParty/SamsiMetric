<?php

require_once("./PHP/sql.php");

if ($virtualAPI["server"]['REQUEST_METHOD'] == 'PATCH') {
    //Replace The Projects File (Admin Only)

    $newProjects = $virtualAPI["input"];

    ManagerOnly();
    SetConfigFile('projects.json', $newProjects); // Validation Is Client Side, If It Messes Up, Then Someone Made A Bad Request

    //Purge Unused Icons To Save Space
    //There's No Need To Traverse The JSON Tree, A Simple Contains Check Is Fine
    $projectData = GetConfigFile('projects.json');
    $allIcons = DB::query("SELECT * FROM icons");

    foreach ($allIcons as $storedIcon) {
        $iconID = $storedIcon["IconID"];
        if (!str_contains($projectData, $iconID)) { //Quick And Dirty Lookup
            DB::query("DELETE FROM icons WHERE IconID=%s", $iconID); //Icon Is Not Needed
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
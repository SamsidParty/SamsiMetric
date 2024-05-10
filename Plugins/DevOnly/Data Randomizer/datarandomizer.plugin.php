<?php

//This File Should Only Run When Included By The Snapshot Writer
$included_files = get_included_files();

foreach ($included_files as $filename) {
    if (str_ends_with($filename, "PHP/MetricWriters/snapshot.php")) {
        //Randomize The Data In The Database
        $pluginFolder = PluginAPI::$pluginFolder;
        $data = file_get_contents($pluginFolder . "/DevOnly/Data Randomizer/randomvalues.sql");

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
    }
}

?>
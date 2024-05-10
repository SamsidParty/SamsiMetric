<?php

//This File Should Only Run When Included By The Snapshot Writer
$included_files = get_included_files();

foreach ($included_files as $filename) {
    if (str_ends_with($filename, "PHP/MetricWriters/snapshot.php")) {
        //Randomize The Data In The Database
        DB::query("UPDATE data_total SET Total = FLOOR(1 + RAND() * 300)");
    }
}

?>
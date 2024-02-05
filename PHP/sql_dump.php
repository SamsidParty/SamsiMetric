<?php 

require_once("./PHP/sql.php");

function DumpAsArray() 
{
	$tables = DB::query("SHOW TABLES;");
	$result = array();

	foreach ($tables as $table_as) {
		$table = reset($table_as);

		if (str_contains($table, "data_")) {
			//This Is Not Vulnerable To SQL Injection Since The Table Name Is Trusted
			$tdata = DB::query("SELECT * FROM " . $table);

			$result[$table] = $tdata;
		}
	}

	//Temporary Solution
	//TODO: Stream This Data To The Client As Needed
	for ($i = 0; $i < sizeof($result["data_snapshot"]); $i++) {
		$result["data_snapshot"][$i]["SnapData"] = base64_encode($result["data_snapshot"][$i]["SnapData"]);
	}


	return $result;
}

function DumpAsJSON() 
{
	$result = DumpAsArray();
	return json_encode($result);
}

?>
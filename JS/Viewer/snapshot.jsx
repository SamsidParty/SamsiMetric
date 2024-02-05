var LoadedSnapshotRanges = [];
var LoadedSnapshots = [];

async function LoadSnapshotRange(from, to) {
    //Sync Snapshot Range From Server
    var response = await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": JSON.stringify({
            action: "get_snapshot_data",
            date_start: from,
            date_end: to
        }) })
    });

    if (!response.ok) {
        if (response.status == 401 || response.status == 424) {
            window.location.href = "./Login"
        }
        dataStatus = "error";
        return;
    }

    (await response.json()).data_snapshot.forEach((l_snap) => {
        var identity = l_snap.MetricID + "_" + l_snap.SnapTime; // Prevents Duplication
        if (LoadedSnapshots[identity] == undefined) {
            LoadedSnapshots[identity] = l_snap;
        }
    });
    LoadedSnapshotRanges.push([from, to]);

}
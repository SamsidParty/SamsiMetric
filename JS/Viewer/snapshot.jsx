var LoadedSnapshotRanges = [];
var LoadedSnapshots = [];
var SnapshotsFor = {};

//The Names Of The Tables That Snapshots Are Taken From
var SnapshotTables = {
    total: "data_total",
    average: "data_average",
    country: "data_country"
}

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
        if (SnapshotsFor[l_snap.MetricID] == undefined) {
            SnapshotsFor[l_snap.MetricID] = {};
        }
        SnapshotsFor[l_snap.MetricID][l_snap.SnapTime] = l_snap;
    });
    LoadedSnapshotRanges.push([from, to]);
}

function SnapshotAt(metric, time) {
    if (SnapshotsFor[metric] == undefined) {
        return null;
    }

    var closestSnapshot = {
        SnapTime: -Infinity
    };
    Object.keys(SnapshotsFor[metric]).forEach((l_key) => {
        var l_snap = SnapshotsFor[metric][l_key];
        if (Math.abs(l_snap.SnapTime - time) < Math.abs(closestSnapshot.SnapTime - time)) {
            closestSnapshot = l_snap;
        }
    });

    return closestSnapshot;
}

function ClearLoadedSnapshots() {
    LoadedSnapshotRanges = [];
    LoadedSnapshots = [];
    SnapshotsFor = {};
}
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
    try {
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

        var snaps = (await SWMessagePack.decodeAsync((await response.arrayBuffer()))).data_snapshot;

        for (var i = 0; i < snaps.length; i++) {
            var l_snap = snaps[i];

            var identity = l_snap.MetricID + "_" + l_snap.SnapTime; // Prevents Duplication
            if (LoadedSnapshots[identity] == undefined) {
                LoadedSnapshots[identity] = l_snap;
            }
            if (SnapshotsFor[l_snap.MetricID] == undefined) {
                SnapshotsFor[l_snap.MetricID] = {};
            }
            SnapshotsFor[l_snap.MetricID][l_snap.SnapTime] = l_snap;
        }


        LoadedSnapshotRanges.push(from + "_" + to);
    }
    catch (err) {
        //TODO: GUI Error Handler
        console.error(err);
    }
}

async function DownloadSnapData(l_snap) {

    //Check For Cached Data, No Need To Download And Decompress Again
    if (!!l_snap.CachedSnapData) {
        return l_snap.CachedSnapData;
    }

    var response = await fetch(Backend, {
        headers: DefaultHeaders({ "X-Params": JSON.stringify({
            action: "get_snapshot_data",
            get_data_directly: "true",
            snap_time: l_snap.SnapTime,
            metric_id: l_snap.MetricID
        }) })
    });

    if (!response.ok) {
        if (response.status == 401 || response.status == 424) {
            window.location.href = "./Login"
        }
        dataStatus = "error";
        return null;
    }

    var data = await SWMessagePack.decodeAsync(await SWFFlate.decompressAsync(new Uint8Array(await response.arrayBuffer())));
    l_snap.CachedSnapData = data;
    return data;
}

function SnapshotAt(metric, time) {

    //https://stackoverflow.com/a/48875938/18071273
    var BinarySearchSnapshots = (arr, target) => {
        var midpoint = Math.floor(arr.length/2);

        if (arr[midpoint].SnapTime === target){
            return arr[midpoint];
        }
        if (arr.length === 1){
            return arr[0];
        }
    
        if (arr[midpoint].SnapTime > target){
            return BinarySearchSnapshots(arr.slice(0, midpoint), target);
        }
        else if (arr[midpoint].SnapTime < target){
            return BinarySearchSnapshots(arr.slice(midpoint), target);
        }
    }

    if (SnapshotsFor[metric] == undefined) {
        return null;
    }

    if (time == Infinity) {
        return SnapshotsFor[metric].length > 0;
    }

    var closestSnapshot = {
        SnapTime: -Infinity
    };
    closestSnapshot = BinarySearchSnapshots(Object.values(SnapshotsFor[metric]), time);

    return closestSnapshot;
}

function ClearLoadedSnapshots() {
    LoadedSnapshotRanges = [];
    LoadedSnapshots = [];
    SnapshotsFor = {};
}

function IsRangeLoaded(range) {
    return LoadedSnapshotRanges.includes(range[0] + "_" + range[1]);
}
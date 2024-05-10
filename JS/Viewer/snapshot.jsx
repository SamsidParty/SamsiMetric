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
            if (ShouldLoadSnapshot(l_snap)) {
                var identity = l_snap.MetricID + "_" + l_snap.SnapTime; // Prevents Duplication
                if (LoadedSnapshots[identity] == undefined) {
                    LoadedSnapshots[identity] = l_snap;
                }
                if (SnapshotsFor[l_snap.MetricID] == undefined) {
                    SnapshotsFor[l_snap.MetricID] = {};
                }
                SnapshotsFor[l_snap.MetricID][l_snap.SnapTime] = l_snap;
            }
        }


        LoadedSnapshotRanges.push(from + "_" + to);
    }
    catch (err) {
        //TODO: GUI Error Handler
        console.error(err);
    }
}

async function ParseSnapData(l_snap) {

    //Check For Cached Data, No Need To Decompress And Deserialize Again
    if (!!l_snap.CachedSnapData) {
        return l_snap.CachedSnapData;
    }

    var data = await SWMessagePack.decodeAsync(await SWFFlate.decompressAsync(l_snap.SnapData));
    l_snap.CachedSnapData = data;
    return data;
}

//Helps To Scale Back The Amount Of Snapshots To Load
//Loads Less Snapshots As Time Goes Further Back
function ShouldLoadSnapshot(l_snap) {

    return true;

    var tDiffMS = Math.abs(new Date() - new Date(l_snap.SnapTime * 1000));
    var tDiff = Math.floor((tDiffMS / 1000) / 60);

    if (tDiff < 60) { //Less Than An Hour Ago
        return true;
    }
    else if (tDiff < 1440) { // Less Than 24 Hours Ago
        return tDiff % 30 == 0;
    }
    else if (tDiff < 10080) { // Less Than 1 Week Ago
        return tDiff % 30 == 0;
    }


    return false;
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
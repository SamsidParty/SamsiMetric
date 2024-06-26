var LoadedSnapshotRanges = [];
var LoadedSnapshots = [];
var SnapshotsFor = {};

//The Names Of The Tables That Snapshots Are Taken From
var SnapshotTables = {
    total: "data_total",
    average: "data_average",
    country: "data_country"
}

/*
timeRange is an object like this 
{
    name: "1Y",
    fullName: "Past Year",
    unix: [from, to],
    detail: 12,
}
*/

async function LoadSnapshotRange(timeRange) {

    if (IsRangeLoaded(timeRange)) { return; }

    try {
        //Sync Snapshot Range From Server
        var response = await fetch(Backend, {
            headers: DefaultHeaders({ "X-Params": JSON.stringify({
                action: "get_snapshot_range",
                range: JSON.stringify(timeRange)
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
            
            l_snap.SnapData = await SWMessagePack.decodeAsync(await SWFFlate.decompressAsync(l_snap.SnapData)); // Decompress SnapData In Place

            var identity = l_snap.MetricID + "_" + l_snap.SnapTime; // A Unique Identifier
            l_snap.identity = identity;

            if (LoadedSnapshots[identity] == undefined) {
                LoadedSnapshots[identity] = l_snap;
            }
            if (SnapshotsFor[l_snap.MetricID] == undefined) {
                SnapshotsFor[l_snap.MetricID] = {};
            }
            SnapshotsFor[l_snap.MetricID][l_snap.SnapTime] = l_snap;
        }


        LoadedSnapshotRanges.push(JSON.stringify(timeRange));
    }
    catch (err) {
        //TODO: GUI Error Handler
        console.error(err);
    }
}


//Returns A 2D Array Of Snapshots In A Time Range, Where timeRange Is A Time Range And ids Is An Array Of Metric IDs
function GetSnapshotsGroupedInRange(timeRange, ids) {
    var snaps = [];

    for (let i = 0; i < ids.length; i++) {
        snaps.push(GetSnapshotsInRange(timeRange, ids[i]));
    }

    return snaps;
}

//Returns An Array Of Snapshots In A Time Range, Where timeRange Is A Time Range And id Is A Metric ID
function GetSnapshotsInRange(timeRange, id) {

    var snaps = []

    for (let i = 0; i < timeRange.detail; i++) {
        var timeOfSnap = Math.ceil(timeRange.unix[0] + ((Math.abs(timeRange.unix[0] - timeRange.unix[1]) / timeRange.detail) * (i + 1)));
        var snap = SnapshotAt(id, timeOfSnap);

        if (!!snap) {
            snaps.push(snap);
        }
    }

    return snaps;
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

    //Check If There Is An Exact Match
    //If Not, Binary Search The Nearest Match
    closestSnapshot = SimpleSearchSnapshot(metric, time) || BinarySearchSnapshots(Object.values(SnapshotsFor[metric]), time);
    return closestSnapshot;
}

function SimpleSearchSnapshot(metricID, time) {
    var timeMinute = Math.floor(time / 60) * 60;

    if (LoadedSnapshots[metricID + "_" + time]) { // Try Exact Time
        return LoadedSnapshots[metricID + "_" + time];
    }
    else if (LoadedSnapshots[metricID + "_" + timeMinute]) { // Try Nearest Minute
        return LoadedSnapshots[metricID + "_" + timeMinute];
    }
    else if (LoadedSnapshots[metricID + "_" + timeMinute - 60]) { // Try Nearest Minute - 1
        return LoadedSnapshots[metricID + "_" + timeMinute - 60];
    }
    else if (LoadedSnapshots[metricID + "_" + timeMinute + 1]) { // Account For 1 Second Errors
        return LoadedSnapshots[metricID + "_" + timeMinute + 1];
    }
    else if (LoadedSnapshots[metricID + "_" + timeMinute - 1]) { // Account For 1 Second Errors
        return LoadedSnapshots[metricID + "_" + timeMinute - 1];
    }

    //Imperfect SnapTime, Proceed To Binary Search
    return null;
}

function ClearLoadedSnapshots() {
    LoadedSnapshotRanges = [];
    LoadedSnapshots = [];
    SnapshotsFor = {};
}

function IsRangeLoaded(timeRange) {
    return LoadedSnapshotRanges.includes(JSON.stringify(timeRange)); // Only Match Exact Same Time Range Args
}
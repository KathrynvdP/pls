
/* eslint-disable indent */

exports.testingSAB = functions.runWith(runtimeOpts).pubsub.schedule('every 2 minutes').timeZone('Africa/Johannesburg').onRun(() => {
    getDestinationList().then(function (destinationList) {
        return getTrucksArray().then(function (truckList) {
            return truckList.forEach(truck => {
                return getLocation(truck).then(function (location) {

                })
            })
        });
    })
});

function getTrucksArray() {
    return new Promise((resolve, reject) => {
        admin.firestore().collection('trucks').where('tracking', "==", true).where('fleet', '==', 'SAB').get().then(trucks => {
            let truckList = [];
            let i = 0;
            const len = trucks.docs.length;
            trucks.docs.forEach(truck => {
                truckList.push(truck.data())
                i = ++i;
            })
            if (i == len) {
                let list = truckList;
                return resolve(list);
            }
        })
    })
}

function getDestinationList() {
    return new Promise((resolve, reject) => {
        admin.firestore().collection('destinations').orderBy("latUpper").get().then(destinations => {
            var destList = [];
            const len = destinations.docs.length;
            let i = 0;
            destinations.docs.forEach(dest => {
                destList.push(dest.data())
                i = ++i
            });
            if (i == len) {
                let list = destList;
                return resolve(list);
            }
        })
    })
};
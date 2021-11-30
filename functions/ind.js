exports.startGeofence = functions.runWith(runtimeOpts).pubsub.schedule('every 10 minutes').timeZone('Africa/Johannesburg').onRun(() => {
    geoFence().then(function (fence) {
        console.log("this is the fence", fence)
        getLoc().then(function (results) {
            if (results.length !== 0) {
                var currentLat = results[0].lat;
                var currentLng = results[0].lon;
                console.log("trucks Location:", currentLat, currentLng)
                if (currentLat <= fence.latUpper && currentLat >= fence.latLower) {
                    console.log("In latitude")
                }
                if (currentLng <= fence.lngRight && currentLng >= fence.lngLeft) {
                    console.log("In longitude")
                }
            }
        })
    })
})

function geoFence() {
    return new Promise(function (resolve, reject) {
        let lat = -26.549910596150543;
        let lng = 28.007532557669506;
        var fence = { latUpper: lat + 0.0045, latLower: lat - 0.0045, lngLeft: lng - 0.0045, lngRight: lng + 0.0045, }
        resolve(fence);
    })
}

function getLoc() {
    return new Promise(function (resolve, reject) {

        var reg = "C02-FS75GJGP";
        var axios = require('axios');

        var config = {
            method: 'get',
            url: `https://api.autotraklive.com/vehicleposition/GetVehiclePositionsByRegistration/${reg}`,
            headers: {
                'Authorization': 'Basic MzAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42'
            }
        };

        axios(config)
            .then(function (response) {
                console.log("results: ", JSON.stringify(response.data));
                var results = response.data;
                resolve(results);
            })
            .catch(function (error) {
                console.log(error);
            });

    });
}


///////////////////////////////////////////////////////////////////////////////////////////////
//truck info checks 

exports.SABtrack = functions.runWith(runtimeOpts).pubsub.schedule('every 1 minutes').timeZone('Africa/Johannesburg').onRun(() => {
    return admin.firestore().collection('trucks').get().then(trucks => {
        trucks.forEach(truck => {
            if (truck.data().code && truck.data().fleetNo) {
                getLocation(truck.data()).then(function (results) {
                    if (results.length !== 0) {
                        checkStop(truck.data(), results[0])
                    }
                })
            }
        })
    })
})

function checkStop(loc1, loc2) {
    return new Promise(function (resolve, reject) {
        var lat1 = loc1.lat.toFixed(5);
        var lng1 = loc1.lng.toFixed(5);
        var lat2 = loc2.lat.toFixed(5);
        var lng2 = loc2.lng.toFixed(5);
        var speed = loc2.speed;

        console.log("lat1 and lat 2 results", lat1, lat2)

        if (speed === 0) {
            if (lat1 !== lat2 || lng1 !== lng2) {
                admin.firestore().collection('trucks').doc()
                // indicates truck is moving if either lat or long changes but is currently stopped for a short duration
            }
        }

        if (speed !== 0) {
            //  indicates truck is moving as speed is not zero
        }
    })
}

function trackOrder(order) {
    return new Promise(function (resolve, reject) {

        getLocation(order).then(function (results) {
            if (results.length !== 0) {
                var currentPos = { lat: 0, lng: 0, address: '' }
                currentPos.lat = results[0].lat;
                currentPos.lng = results[0].lon;
                currentPos.address = results[0].address;
                var current = currentPos.lat + ',' + currentPos.lng;
                var end = order.endPos.lat.toString() + ',' + order.endPos.lng.toString();

                var origins = [current];
                var destinations = [end];

                distance.key('AIzaSyDQyBk6S7DPRrPeB926Viip9mYlcUjsQB8');
                distance.units('metric');

                distance.matrix(origins, destinations, function (err, distances) {
                    if (err) {
                        return console.log(err);
                    }
                    if (!distances) {
                        return console.log('no distances');
                    }
                    if (distances.status == 'OK') {
                        for (var i = 0; i < origins.length; i++) {
                            for (var j = 0; j < destinations.length; j++) {
                                var origin = distances.origin_addresses[i];
                                var destination = distances.destination_addresses[j];
                                if (distances.rows[0].elements[j].status == 'OK') {
                                    var calcDist = (distances.rows[i].elements[j].distance.value) / 1000
                                    if (calcDist < 30) {
                                        order.status = 'On Site';
                                    } else {
                                    }
                                    var distance = distances.rows[i].elements[j].distance.text;
                                    var duration = distances.rows[i].elements[j].duration.text;
                                    // console.log(now)
                                    var eta = distances.rows[i].elements[j].duration.value / 60
                                    // console.log('eta:' + moment(eta).format('HH:mm'))
                                    admin.firestore().collection(`delivery-notes`).doc(order.key).update({ estDist: distance, estTime: duration, eta: eta, status: order.status, currentPos: currentPos });
                                    resolve()
                                } else {
                                    console.log(destination + ' is not reachable by land from ' + origin);
                                }
                            }
                        }
                    } else {
                        console.log('No Logs')
                    }
                });
            } else {
                console.log('No Results')
                resolve();
            }
        }).catch(function (error) {
            return console.error("Failed!" + error);
        })

    });
}

// const httpsAgent = new https.Agent({ rejectUnauthorized: false });
function getLocation(order) {
    return new Promise(function (resolve, reject) {

        var reg = order.fleetNo + '-' + order.code
        var axios = require('axios');

        var config = {
            method: 'get',
            url: `https://api.autotraklive.com/vehicleposition/GetVehiclePositionsByRegistration/${reg}`,
            headers: {
                'Authorization': 'Basic MzAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42'
            }
        };

        axios(config)
            .then(function (response) {
                console.log("results: ", JSON.stringify(response.data));
                var results = response.data;
                resolve(results);
            })
            .catch(function (error) {
                console.log(error);
            });

    });
}


/**
 * dissmantleLicDisk
 */
function dismantleLicDisk(hashValue) {
    let receivedData: string = JSON.stringify(hashValue.text);
    let data = new Array();
    var carDetails = {
        RegNum: '',
        carType: '',
        carMake: '',
        carModel: '',
        carColour: '',
        vinNum: '',
        engineNum: ''
    };
    data = receivedData.split('%');
    carDetails.RegNum = data[6];
    carDetails.carType = data[8];
    carDetails.carMake = data[9];
    carDetails.carModel = data[10];
    carDetails.carColour = data[11];
    carDetails.vinNum = data[12];
    carDetails.engineNum = data[13];
    return carDetails;

}

export { dismantleLicDisk as dismantleLicDisk };


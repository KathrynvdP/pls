"use strict";
const functions = require("firebase-functions");
const { Storage } = require("@google-cloud/storage");
const googleCloudStorage = new Storage({
  projectId: "premier-logistics",
  keyFilename: "service-account.json",
});

const admin = require("firebase-admin");
const BUCKET = "premier-logistics.appspot.com";
const excelToJson = require("convert-excel-to-json");
var axios = require("axios");
var https = require("https");
const { v4 } = require("uuid");
var moment = require("moment");
admin.initializeApp();
const PdfPrinter = require("pdfmake/src/printer");
var pdfMake = require("pdfmake/build/pdfmake");
var pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;
const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "1GB",
};
const nodemailer = require("nodemailer");
const gmailEmail = "dashalert@plsolutions.co.za";
const gmailPassword = "da@PLS101";
const mailTransport = nodemailer.createTransport({
  host: "smtp.office365.com",
  auth: {
    user: gmailEmail,
    pass: gmailPassword,
  },
});

const { bucket } = require("firebase-functions/lib/providers/storage");

var headerImage;
var logoPremier;
var logoMichelin;

exports.createUser = functions.firestore
  .document("users/{uid}")
  .onCreate((snap) => {
    const newUser = snap.data();
    if (newUser.name && newUser.email) {
      return admin
        .auth()
        .createUser({
          uid: newUser.key,
          email: newUser.email,
          emailVerified: false,
          password: newUser.password,
          displayName: newUser.name,
          disabled: false,
        })
        .then(() => {})
        .catch(function (error) {
          return console.error("Error creating new user:", error);
        });
    } else {
      return console.log("Not a new User...");
    }
  });

exports.createDashUser = functions.firestore
  .document("dashboard-users/{uid}")
  .onCreate((snap) => {
    const newUser = snap.data();
    if (newUser.name && newUser.email) {
      return admin
        .auth()
        .createUser({
          uid: newUser.key,
          email: newUser.email,
          emailVerified: false,
          password: newUser.password,
          displayName: newUser.name,
          disabled: false,
        })
        .then(() => {})
        .catch(function (error) {
          return console.error("Error creating new user:", error);
        });
    } else {
      return console.log("Not a new User...");
    }
  });

exports.createClient = functions.firestore
  .document("clients/{uid}")
  .onCreate((snap) => {
    const newUser = snap.data();
    if (newUser.name && newUser.email) {
      return admin
        .auth()
        .createUser({
          uid: newUser.key,
          email: newUser.email,
          emailVerified: false,
          password: newUser.password,
          displayName: newUser.name,
          disabled: false,
        })
        .then(() => {})
        .catch(function (error) {
          return console.error("Error creating new user:", error);
        });
    } else {
      return console.log("Not a new User...");
    }
  });

// Fuel Economy for vehicle
exports.fuelLogs = functions.firestore
  .document("fuel-records/{uid}")
  .onWrite((change) => {
    const newlog = change.after.data();

    const date = moment(new Date().toISOString())
      .locale("en")
      .format("YYYY/MM/DD");
    const time = moment(new Date().toISOString()).locale("en").format("HH:mm");

    var newKM = newlog.km;
    var prevKM;
    var prevLitres;
    var economy;

    return admin
      .firestore()
      .collection("fuel-records")
      .where("code", "==", newlog.code)
      .orderBy("date", "desc")
      .orderBy("time", "desc")
      .limit(2)
      .get()
      .then((logs) => {
        logs.forEach((log) => {
          if (log.data().date !== newlog.date) {
            console.log("Different day");
            prevKM = log.data().km;
            prevLitres = log.data().litre;
            console.log(prevLitres, newKM, prevKM);
            economy = (Number(newKM) - Number(prevKM)) / Number(prevLitres);
          } else {
            console.log("In else");
            if (
              moment(newlog.time, "HH:mm").isAfter(
                moment(log.data().time, "HH:mm")
              )
            ) {
              console.log("Same day, before");
              prevKM = log.data().km;
              prevLitres = log.data().litre;
              console.log(prevLitres, newKM, prevKM);
              economy = (Number(newKM) - Number(prevKM)) / Number(prevLitres);
            } else {
              console.log("No log");
            }
          }
          console.log(economy);
        });
        if (economy !== NaN && economy !== undefined) {
          admin
            .firestore()
            .collection("fuel-records")
            .doc(newlog.key)
            .update({
              fuelEco: economy.toFixed(2),
            });
          admin
            .firestore()
            .collection("trucks")
            .doc(newlog.code)
            .update({
              fuelEco: economy.toFixed(2),
            });
          return admin
            .firestore()
            .collection(`trucks/${newlog.code}/fuel-economy`)
            .doc(date)
            .set({
              date: date,
              time: time,
              fuelEco: economy.toFixed(2),
            });
        }
      })
      .catch(function (error) {
        return console.error(error);
      });
  });

// Fuel Economy for drivers
exports.fuelLogsDrivers = functions.firestore
  .document("fuel-records/{uid}")
  .onCreate((snap) => {
    const newlog = snap.data();
    const date = moment(new Date().toISOString())
      .locale("en")
      .format("DD-MM-YYYY");
    const time = moment(new Date().toISOString()).locale("en").format("HH:mm");

    var newKM = newlog.km;
    var prevKM;
    var prevLitres;
    var economy;

    return admin
      .firestore()
      .collection("fuel-records")
      .where("driver", "==", newlog.driver)
      .orderBy("date", "desc")
      .orderBy("time", "desc")
      .limit(2)
      .get()
      .then((logs) => {
        logs.forEach((log) => {
          if (log.data().date !== newlog.date) {
            console.log("Different day");
            prevKM = log.data().km;
            prevLitres = log.data().litre;
            console.log(prevLitres, newKM, prevKM);
            economy = (Number(newKM) - Number(prevKM)) / Number(prevLitres);
          } else {
            if (
              moment(newlog.time, "HH:mm").isAfter(
                moment(log.data().time, "HH:mm")
              )
            ) {
              console.log("Same day, before");
              prevKM = log.data().km;
              prevLitres = log.data().litre;
              console.log(prevLitres, newKM, prevKM);
              economy = (Number(newKM) - Number(prevKM)) / Number(prevLitres);
            } else {
              console.log("No log");
            }
          }
        });
        if (economy !== NaN && economy !== undefined) {
          admin
            .firestore()
            .collection("users")
            .where("name", "==", newlog.driver)
            .get()
            .then((users) => {
              users.forEach((user) => {
                admin
                  .firestore()
                  .collection("users")
                  .doc(user.data().key)
                  .update({
                    fuelEco: economy.toFixed(2),
                  });
              });
            });
          return admin
            .firestore()
            .collection(`trucks/${newlog.code}/fuel-economy`)
            .doc(date)
            .set({
              date: date,
              time: time,
              fuelEco: economy.toFixed(2),
            });
        }
      })
      .catch(function (error) {
        return console.error(error);
      });
  });

exports.economyCalc = functions.firestore
  .document("fuel-records/{uid}")
  .onWrite((change) => {
    const inspec = change.data();

    var fuelEco = 0;
    var total = 0;
    const date = moment(new Date().toISOString())
      .locale("en")
      .format("DD-MM-YYYY");
    const time = moment(new Date().toISOString()).locale("en").format("HH:mm");
    admin.firestore().collection("fuel-economy").doc(date).set({
      date: date,
      time: time,
      fuelEco: fuelEco,
    });

    return admin
      .firestore()
      .collection("trucks")
      .get()
      .then((trucks) => {
        trucks.forEach((truck) => {
          admin
            .firestore()
            .collection(`trucks/${truck.data().registration}/fuel-economy`)
            .orderBy("date", "desc")
            .orderBy("time", "desc")
            .limit(1)
            .get()
            .then((items) => {
              items.forEach((item) => {
                if (item.data().fuelEco) {
                  fuelEco = fuelEco + Number(item.data().fuelEco);
                  total = total + 1;
                  admin
                    .firestore()
                    .collection("fuel-economy")
                    .doc(date)
                    .update({
                      fuelEco: fuelEco / total,
                    });
                }
              });
            })
            .catch(function (error) {
              return console.error(error);
            });
        });
      })
      .catch(function (error) {
        return console.error(error);
      });
  });

///////////       Check for incomplete forms       //////////

exports.formCheck = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 1 hours")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return new Promise((resolve, reject) => {
      //var now = moment(new Date().toISOString()).locale('en').subtract(15, "minutes").format('HH:mm');

      var now = new Date();
      var then = moment(now).add(2, "hours").subtract(40, "minutes").toDate();
      // console.log(then)

      return admin
        .firestore()
        .collection("inspections")
        .where("duration", "==", {})
        .get()
        .then((inspecs) => {
          inspecs.forEach((inspec) => {
            console.log(inspec.data().timeIn);

            if (
              moment(inspec.data().timeIn, "HH:mm").isBefore(
                moment(then, "HH:mm")
              )
            ) {
              if (inspec.data().type === "checkin") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ checkinStatus: "Skipped", checkinProgress: 0 });
              } else if (inspec.data().type === "washbay") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ washbayStatus: "Skipped", washbayProgress: 0 });
              } else if (inspec.data().type === "tyrebay") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ tyrebayStatus: "Skipped", tyrebayProgress: 0 });
              } else if (inspec.data().type === "workshop") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ workshopStatus: "Skipped", workshopProgress: 0 });
              } else if (inspec.data().type === "dieselbay") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ dieselbayStatus: "Skipped", dieselbayProgress: 0 });
              } else if (inspec.data().type === "checkout") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(inspec.data().code)
                  .update({ checkoutStatus: "Skipped", checkoutProgress: 0 });
              }
              admin
                .firestore()
                .collection("inspections")
                .doc(inspec.data().key)
                .delete();
            }
          });
          return resolve();
        });
    });
  });

/////    Licence Disk Functions       ////////

// 00 09 1 * *
exports.monthlyLicenceCheck = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("00 09 1 * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var disks = [];
    var thisMonth = moment(new Date()).format("YYYY-MM");
    return admin
      .firestore()
      .collection("trucks")
      .orderBy("licence")
      .orderBy("fleet")
      .get()
      .then((trucks) => {
        trucks.forEach((truck) => {
          if (
            truck.data().licence.slice(0, 7) === thisMonth ||
            moment(new Date(), "YYYY-MM-DD").isAfter(
              moment(truck.data().licence, "YYYY-MM-DD")
            )
          ) {
            disks.push(truck.data());
          }
        });
        console.log("Disks: " + disks);
        return licDiskBody(disks).then(function (body) {
          console.log("Got Body");
          return getLogo()
            .then(function () {
              return licDiskPDF(body)
                .then(function (docDefinition) {
                  console.log("Got pdf doc");
                  const file_name = `PLS_licence-disks/${thisMonth}.pdf`;
                  return createPDF(docDefinition, file_name).then(function (
                    file_name
                  ) {
                    const st = new Storage();
                    const buck = st.bucket(BUCKET);
                    return buck
                      .file(file_name)
                      .download()
                      .then((data) => {
                        const myPdf = data[0];
                        return sendPdfEmail(myPdf);
                      });
                  });
                })
                .catch(function (error) {
                  return console.error("Failed!" + error);
                });
            })
            .catch(function (error) {
              return console.error("Failed!" + error);
            });
        });
      });
  });

function getLogo() {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("logo")
      .doc("logo")
      .get()
      .then((logo) => {
        if (logo.data()) {
          // console.log(logo.data().logo)
          headerImage = logo.data().logo;
        }
        resolve();
      });
  });
}

function createPDF(docDefinition, file_name) {
  return new Promise(function (resolve, reject) {
    const fontDescriptors = {
      Roboto: {
        normal: "fonts/Roboto-Regular.ttf",
        bold: "fonts/Roboto-Bold.ttf",
        italics: "fonts/Roboto-Italic.ttf",
        bolditalics: "fonts/Roboto-BoldItalic.ttf",
      },
    };
    const printer = new PdfPrinter(fontDescriptors);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    //const storage = new Storage({
    //    projectId: 'premier-logistics',
    //});
    const myPdfFile = googleCloudStorage.bucket(BUCKET).file(file_name);

    pdfDoc
      .pipe(myPdfFile.createWriteStream())
      .on("finish", function () {
        resolve(file_name);
      })
      .on("error", function (err) {
        reject("Error: " + err);
      });

    pdfDoc.end();
  });
}

// EMAIL PDF REPORT FUNCTION

function sendPdfEmail(myPdf) {
  const mailOptions = {
    from: '"PLS APP TEAM" <dashalert@plsolutions.co.za>',
    to: "katrynchvdp@gmail.com",
    subject: "PLS: Licence Disks",
    text: `Good Day,\n\nPlease find attached the list of vehicles that expire this month.\n\nKindly,\nApp Team`,
    attachments: [
      {
        filename: `PLS: licence_disks.pdf`,
        content: myPdf,
        contentType: "application/pdf",
      },
    ],
  };
  return mailTransport
    .sendMail(mailOptions)
    .then(() => console.log(`Sent`))
    .catch(function (error) {
      return console.error(
        "There was an error while sending the email:",
        error
      );
    });
}

function licDiskBody(disks) {
  return new Promise(function (resolve) {
    var body = [];
    var columns = [
      { text: "Fleet", style: "headLabel", alignment: "center" },
      { text: "Fleet Number", style: "headLabel", alignment: "center" },
      { text: "Registration", style: "headLabel", alignment: "center" },
      { text: "Licence Expiry Date", style: "headLabel", alignment: "center" },
    ];
    body.push(columns);

    disks.forEach((disk) => {
      body.push([
        { text: disk.fleet },
        { text: disk.fleetNo },
        { text: disk.registration },
        { text: disk.licence },
      ]);
    });

    resolve(body);
  });
}

function licDiskPDF(body) {
  return new Promise(function (resolve) {
    var date = moment(new Date()).format("YYYY-MM");

    var docDefinition = {
      content: [
        {
          image: headerImage,
          width: 300,
          alignment: "center",
        },
        { text: `PLS: FLEET LICENCES ${date}`, style: "header" },
        {
          style: "table2",
          table: {
            widths: ["25%", "25%", "25%", "25%"],
            height: 100,
            body: body,
          },
        },
      ],
      styles: {
        headLabel: {
          color: "black",
          bold: true,
        },
        header: {
          fontSize: 18,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 20],
        },
        notes: {
          margin: [0, 20, 0, 20],
        },
        subheader: {
          alignment: "center",
          color: "black",
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 5],
        },
        table: {
          margin: [0, 5, 0, 15],
        },
        table2: {
          fontSize: 10,
        },
        table3: {
          margin: [0, 10, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
      defaultStyle: {
        // alignment: 'justiSfy'
      },
    };
    resolve(docDefinition);
  });
}

exports.operatorAuthNote = functions.firestore
  .document("requests/{uid}")
  .onCreate((change) => {
    const request = change.data();

    var type = "Operator" + ": " + request.fleet;
    var tokens = [];

    return admin
      .firestore()
      .collection("users")
      .where("type", "==", type)
      .where("token", "==", true)
      .get()
      .then((operators) => {
        operators.forEach((operator) => {
          console.log("Op Key: " + operator.data().key);
          admin
            .firestore()
            .collection("tokens")
            .doc(operator.data().key)
            .get()
            .then((token) => {
              console.log(token.data().token);
              if (token.data().token && token.data().token !== "") {
                tokens.push(token.data().token);
              }
            });
        });

        setTimeout(() => {
          console.log(tokens);
          const payload = {
            notification: {
              title: "Truck Requires Authorisation!",
              body: `Truck ${request.fleetNo} requires authorisation.`,
              icon: "https://firebasestorage.googleapis.com/v0/b/premier-logistics.appspot.com/o/logo.jpg?alt=media&token=7b4d2f5b-f59d-4822-9bd2-d9ad2392daf7",
            },
          };
          tokens.forEach((token) => {
            admin
              .messaging()
              .sendToDevice(token, payload)
              .then(() => {
                console.log("Sent");
              });
          });
          admin
            .firestore()
            .collection("requests")
            .doc(request.key)
            .update({ status: "Closed" });
        }, 4000);
      });
  });

exports.operatorCheckinNote = functions.firestore
  .document("checkins/{uid}")
  .onCreate((change) => {
    const checkin = change.data();

    var type = "Operator" + ": " + checkin.fleet;
    console.log("Op type: " + type);
    var tokens = [];
    return admin
      .firestore()
      .collection("users")
      .where("type", "==", type)
      .where("token", "==", true)
      .get()
      .then((operators) => {
        operators.forEach((operator) => {
          console.log("Op: " + operator.data().key);

          admin
            .firestore()
            .collection("tokens")
            .doc(operator.data().key)
            .get()
            .then((token) => {
              console.log(token.data().token);
              if (token.data().token && token.data().token !== "") {
                tokens.push(token.data().token);
              }
            });
        });
        setTimeout(() => {
          console.log(tokens);
          const payload = {
            notification: {
              title: "Truck Checked In!",
              body: `Truck ${checkin.fleetNo} just completed the Check In`,
              icon: "https://firebasestorage.googleapis.com/v0/b/premier-logistics.appspot.com/o/logo.jpg?alt=media&token=7b4d2f5b-f59d-4822-9bd2-d9ad2392daf7",
            },
          };
          tokens.forEach((token) => {
            admin
              .messaging()
              .sendToDevice(token, payload)
              .then(() => {
                console.log("Sent");
              });
          });
          admin
            .firestore()
            .collection("checkins")
            .doc(checkin.key)
            .update({ status: "Closed" });
        }, 4000);
      });
  });

exports.operatorDevsNote = functions.firestore
  .document("deviations/{uid}")
  .onCreate((change) => {
    const devs = change.data();

    var type = "Operator" + ": " + devs.fleet;
    console.log("Op type: " + type);
    admin
      .firestore()
      .collection("trucks")
      .doc(devs.code)
      .update({ deviations: true });
    var tokens = [];
    var emails = [];
    return admin
      .firestore()
      .collection("users")
      .where("type", "==", type)
      .where("token", "==", true)
      .get()
      .then((operators) => {
        operators.forEach((operator) => {
          console.log("Op: " + operator.data().key);
          emails.push(operator.data().email);
          admin
            .firestore()
            .collection("tokens")
            .doc(operator.data().key)
            .get()
            .then((token) => {
              console.log(token.data().token);
              if (token.data().token && token.data().token !== "") {
                tokens.push(token.data().token);
              }
              const mailOptions = {
                from: '"PLS APP TEAM" <dashalert@plsolutions.co.za>',
                to: operator.data().email,
                subject: "PLS: Deviations Found!",
                text: `Good Day,\n\nTruck ${devs.fleetNo} just completed the ${devs.inspection} with deviations\n\nKindly,\nApp Team`,
              };
              mailTransport
                .sendMail(mailOptions)
                .then(() => console.log(`Sent`))
                .catch(function (error) {
                  return console.error(
                    "There was an error while sending the email:",
                    error
                  );
                });
            });
        });
        setTimeout(() => {
          console.log(tokens);
          const payload = {
            notification: {
              title: "Deviations Found!",
              body: `Truck ${devs.fleetNo} just completed the ${devs.inspection} with deviations`,
              icon: "https://firebasestorage.googleapis.com/v0/b/premier-logistics.appspot.com/o/logo.jpg?alt=media&token=7b4d2f5b-f59d-4822-9bd2-d9ad2392daf7",
            },
          };
          tokens.forEach((token) => {
            admin
              .messaging()
              .sendToDevice(token, payload)
              .then(() => {
                console.log("Sent");
              });
          });
          return admin
            .firestore()
            .collection("deviations")
            .doc(devs.key)
            .update({ status: "Closed" });
        }, 4000);
      });
  });

exports.noteCheck = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("25 8 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var token =
      "d24vt2T4xIg:APA91bH-0eOil4-yCpVWArTgZNbznifv-wgdu3MBPMB4a64LlWoUeupBGKJ5Jt_aQfOt5tsH7DtDNLEGjrykpm_p2Zue92Xc5_Ivsi1aSXiuGVQM9a43oIlm7UjMU8WWTxJamMKt3LWe";

    const payload = {
      notification: {
        title: "Truck Checked In!",
        body: `Truck just completed the Check In`,
        icon: "https://firebasestorage.googleapis.com/v0/b/premier-logistics.appspot.com/o/logo.jpg?alt=media&token=7b4d2f5b-f59d-4822-9bd2-d9ad2392daf7",
      },
    };
    return admin.messaging().sendToDevice(token, payload);
  });

// Trailer change
exports.changeTrailers = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("00 10 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return admin
      .firestore()
      .collection("trucks")
      .where("fleet", "==", "CROSSBORDER")
      .get()
      .then((trucks) => {
        console.log("In trucks");
        return trucks.forEach((truck) => {
          if (truck.data().fleetNo.startsWith("CP")) {
            console.log(truck.data().code);
            return admin
              .firestore()
              .collection("codes")
              .doc(truck.data().code)
              .update({ type: "trailers" })
              .then(() => {
                return admin
                  .firestore()
                  .collection("trailers")
                  .doc(truck.data().code)
                  .set(truck.data())
                  .then(() => {
                    admin
                      .firestore()
                      .collection("trucks")
                      .doc(truck.data().code)
                      .delete();
                    return console.log("fleet No: " + truck.data().fleetNo);
                  });
              });
          } else {
            return;
          }
        });
      });
  });

exports.orderDist = functions.firestore
  .document("delivery-notes/{uid}")
  .onCreate((change) => {
    const order = change.data();

    let start = {
      lat: order.currentPos.lat,
      lon: order.currentPos.lng,
    };

    let end = {
      lat: order.endPos.lat,
      lng: order.endPos.lng,
    };

    getETA(start, end).then((results) => {
      if (results.paths[0]) {
        var dist = results.paths[0].distance / 1000;
        let distance = Math.round(dist) + " km";
        let tim = results.paths[0].time / 60000 + 48 * 60;
        let eta = Math.round(tim * 100) / 100;
        var hrs = tim / 60;
        var rhrs = Math.floor(hrs);
        var minutes = (hrs - rhrs) * 60;
        var rminutes = Math.round(minutes);
        let duration = rhrs + " hour(s) " + rminutes + " mins";
        admin.firestore().collection(`delivery-notes`).doc(order.key).update({
          estDist: distance,
          estTime: duration,
          eta: eta,
        });
        return resolve();
      } else {
        return reject();
      }
    });
  });

exports.startTrack = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 1 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var count = 0;
    return admin
      .firestore()
      .collection("delivery-notes")
      .where("tracking", "==", true)
      .get()
      .then((notes) => {
        notes.forEach((order) => {
          if (order.data().tracking) {
            count = count + 1;
            trackOrder(order.data())
              .then(function () {
                console.log(order.data().delNote, " Done");
              })
              .catch(function (error) {
                return console.error("Failed!" + error);
              });
          }
        });
        console.log(count);
        return console.log("Complete");
      });
  });

function trackOrder(order) {
  return new Promise(function (resolve, reject) {
    getLocation(order)
      .then(function (results) {
        if (results.length !== 0) {
          var currentPos = { lat: 0, lng: 0, address: "" };
          currentPos.lat = results[0].lat;
          currentPos.lng = results[0].lon;
          currentPos.address = results[0].address;
          let end = {
            lat: order.endPos.lat,
            lng: order.endPos.lng,
          };
          var timePrevCheck = order.timeUpdate;
          var timeNow = moment(new Date().toISOString())
            .locale("en")
            .format("YYYY/MM/DD, HH:mm");
          var totalDur = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
            moment(timePrevCheck, "YYYY/MM/DD, HH:mm"),
            "minutes",
            true
          );

          if (totalDur >= 5.0 || !order.timeUpdate) {
            if (
              order.currentPos.lat !== results[0].lat ||
              order.currentPos.lng !== results[0].lon
            ) {
              //indicates change in location
              return getETA(results[0], end).then((results) => {
                if (results.paths[0]) {
                  var dist = results.paths[0].distance / 1000;
                  let distance = Math.round(dist) + " km";
                  let tim = results.paths[0].time / 60000;
                  let eta = Math.round(tim * 100) / 100;
                  var hrs = tim / 60;
                  var rhrs = Math.floor(hrs);
                  var minutes = (hrs - rhrs) * 60;
                  var rminutes = Math.round(minutes);
                  let duration = rhrs + " hour(s) " + rminutes + " mins";

                  //console.log("new ETA", dist, distance, "time:", eta, duration)
                  if (dist < 30) {
                    console.log(order.key, "On Site");
                    // order.status = 'On Site';
                    order.pod = "";
                    order.status = "Complete";
                    order.completedDate = moment(new Date()).format(
                      "YYYY/MM/DD HH:mm"
                    );
                    admin
                      .firestore()
                      .collection("orders")
                      .doc(order.key)
                      .set(order)
                      .then(() => {
                        admin
                          .firestore()
                          .collection("delivery-notes")
                          .doc(order.key)
                          .delete();
                        admin
                          .firestore()
                          .collection("trucks")
                          .doc(order.code)
                          .update({ assigned: false });
                      });
                  }
                  admin
                    .firestore()
                    .collection(`delivery-notes`)
                    .doc(order.key)
                    .update({
                      estDist: distance,
                      estTime: duration,
                      eta: eta,
                      status: order.status,
                      currentPos: currentPos,
                      timeUpdate: timeNow,
                    })
                    .then(
                      console.log(
                        "updated truck",
                        order.code,
                        "new ETA",
                        dist,
                        distance,
                        "time:",
                        eta,
                        duration
                      )
                    );
                  console.log("Resolving: ", order.key);
                  return resolve();
                } else {
                  console.log("No Paths");
                  return reject();
                }
              });
            } else {
              //indicates no change in location and thus eta wont change
              return resolve();
            }
          } else {
            if (
              order.currentPos.lat === results[0].lat &&
              order.currentPos.lng === results[0].lon
            ) {
              //indicates no change in location and thus eta wont change
              return resolve();
            } else {
              let tim = order.eta - 1.0;
              var hrs = tim / 60;
              var rhrs = Math.floor(hrs);
              var minutes = (hrs - rhrs) * 60;
              var rminutes = Math.round(minutes);
              let duration = rhrs + " hour(s) " + rminutes + " mins";
              admin
                .firestore()
                .collection(`delivery-notes`)
                .doc(order.key)
                .update({
                  estTime: duration,
                  eta: tim,
                  status: order.status,
                  currentPos: currentPos,
                })
                .then(
                  console.log(
                    "optimize truck",
                    order.code,
                    "time:",
                    tim,
                    duration
                  )
                );
              return resolve();
            }
          }
        } else {
          console.log("No Results");
          resolve();
        }
      })
      .catch(function (error) {
        return console.error("Failed!" + error);
      });
  });
}

function getETA(start, end) {
  return new Promise(function (resolve, reject) {
    var axios = require("axios");
    let lat1 = start.lat;
    let lng1 = start.lon;

    let lat2 = end.lat;
    let lng2 = end.lng;

    const APIkey = "1470a6eb-c72f-47d0-9fc7-7fe29d840d84";

    var config = {
      method: "get",
      url: `https://graphhopper.com/api/1/route?point=${lat1},${lng1}&point=${lat2},${lng2}&vehicle=truck&locale=en&calc_points=false&key=${APIkey}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        var results = response.data;
        return resolve(results);
        //console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        return reject(error);
      });
  });
}

// const httpsAgent = new https.Agent({ rejectUnauthorized: false });
function getLocation(order) {
  return new Promise(function (resolve, reject) {
    var reg = order.fleetNo + "-" + order.code;
    var axios = require("axios");

    var config = {
      method: "get",
      url: `https://api.autotraklive.com/vehicleposition/GetVehiclePositionsByRegistration/${reg}`,
      headers: {
        Authorization:
          "Basic MzAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42",
      },
    };

    axios(config)
      .then(function (response) {
        //console.log("results: ", JSON.stringify(response.data));
        var results = response.data;
        return resolve(results);
      })
      .catch(function (error) {
        console.log("error", error);
        return reject(error);
      });
  });
}

exports.genEPOD = functions.firestore
  .document("orders/{uid}")
  .onWrite((change) => {
    const prevOrderData = change.before.data();
    const order = change.after.data();
    if (order.deliveryDetails && !prevOrderData.deliveryDetails) {
      return getLogos()
        .then(function () {
          return epodPDF(order)
            .then(function (docDefinition) {
              const file_name = `/orders/${order.delNote}.pdf`;
              return createPDF(docDefinition, file_name).then(function (
                file_name
              ) {
                const st = new Storage();
                const buck = st.bucket(BUCKET);
                return buck
                  .file(file_name)
                  .download()
                  .then((data) => {
                    const bucket = googleCloudStorage.bucket(BUCKET);
                    const file = bucket.file(file_name);
                    return file
                      .getSignedUrl({
                        action: "read",
                        expires: "03-09-2491",
                      })
                      .then((signedUrls) => {
                        admin
                          .firestore()
                          .collection("orders")
                          .doc(order.key)
                          .update({ pod: signedUrls[0] });
                        order.pod = signedUrls[0];
                        autoCustEmails(order);
                      });
                  });
              });
            })
            .catch(function (error) {
              return console.error("Failed!" + error);
            });
        })
        .catch(function (error) {
          return console.error("Failed!" + error);
        });
    } else if (!prevOrderData.pod && order.pod) {
      console.log("Not triggered");
      autoCustEmails(order);
    }
  });

function getLogos() {
  return new Promise(function (resolve, reject) {
    admin
      .firestore()
      .collection("logo")
      .doc("logo")
      .get()
      .then((logo) => {
        if (logo.data()) {
          // console.log(logo.data().logo)
          logoPremier = logo.data().logo;
          logoMichelin = logo.data().logoMichelin;
        }
        resolve();
      });
  });
}

async function epodPDF(note) {
  return new Promise(function (resolve, reject) {
    let pet = note.stock;

    var docDefinition = {
      pageOrientation: "landscape",

      content: [
        // {
        //   image: headerImage,
        //   width: 100,
        //   alignment: 'center'
        // },
        // { text: 'Delivery Note', style: 'header' },
        {
          style: "table2",
          layout: "lightHorizontalLines",
          table: {
            widths: ["25%", "25%", "25%", "25%"],
            body: [
              [
                {
                  stack: [
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "Transaction No", style: "field2" },
                    { text: "Transaction Date", style: "field2" },
                    { text: "Transaction Status", style: "field2" },
                    { text: "Ref No", style: "field2" },
                    { text: "Cust. Ref No", style: "field2" },
                    { text: " ", style: "field2" },
                  ],
                },
                {
                  stack: [
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "Order No.", style: "field2" },
                    { text: "Order Date", style: "field2" },
                  ],
                },
                {
                  stack: [
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    {
                      text: note.startPos.address.split(",")[0],
                      style: "field2",
                    },
                    {
                      text: note.startPos.address.split(",")[1],
                      style: "field2",
                    },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "Tel.", style: "field2" },
                    { text: "Fax", style: "field2" },
                  ],
                },
                {
                  style: "table",
                  layout: "noBorders",
                  table: {
                    widths: ["45%", "10%", "45%"],
                    body: [
                      [
                        { image: logoPremier, width: 100, height: 40 },
                        { text: " ", style: "field2" },
                        { image: logoMichelin, width: 100, height: 30 },
                      ],
                    ],
                  },
                },
              ],
            ],
          },
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 750, y2: 0, lineWidth: 1 }, //Bottom line
          ],
        },
        {
          style: "table2",
          layout: "noBorders",
          table: {
            widths: ["25%", "25%", "25%", "25%"],
            body: [
              [
                {
                  stack: [
                    { text: "Customer", style: "fieldBold" },
                    { text: note.customer.name, style: "field2" },
                    {
                      text: note.customer.address.split(",")[0],
                      style: "field2",
                    },
                    {
                      text: note.customer.address.split(",")[1],
                      style: "field2",
                    },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "TEL:  " + note.customer.contact, style: "field2" },
                    { text: "Fax", style: "field2" },
                  ],
                },
                {
                  stack: [
                    { text: "Transporter", style: "fieldBold" },
                    { text: "PREMIER LOGISTICS SOLUTIONS", style: "field2" },
                    { text: "48 MORRIS STREET", style: "field2" },
                    { text: "MEYERTON FARMS", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "TEL", style: "field2" },
                    { text: "Fax", style: "field2" },
                  ],
                },
                {
                  stack: [
                    { text: "Warehouse", style: "fieldBold" },
                    { text: note.startPos.name, style: "field2" },
                    {
                      text: note.startPos.address.split(",")[0],
                      style: "field2",
                    },
                    {
                      text: note.startPos.address.split(",")[1],
                      style: "field2",
                    },
                    {
                      text: note.startPos.address.split(",")[2],
                      style: "field2",
                    },
                    { text: " ", style: "field2" },
                    { text: "Tel.", style: "field2" },
                    { text: "Fax", style: "field2" },
                  ],
                },
                {
                  stack: [
                    { text: "Consignee", style: "fieldBold" },
                    { text: note.endPos.name, style: "field2" },
                    { text: "Delivery Address", style: "field2" },
                    { text: note.endPos.address, style: "field2" },
                    { text: " ", style: "field2" },
                    { text: " ", style: "field2" },
                    { text: "Tel.", style: "field2" },
                    { text: "Fax", style: "field2" },
                  ],
                },
              ],
            ],
          },
        },

        {
          style: "table2",
          layout: "noBorders",
          table: {
            widths: ["10%", "10%", "20%", "10%", "10%", "40%"],
            body: [
              [
                { text: "ORDER DATE ", style: "field" },
                { text: "DISPATCH DATE", style: "field" },

                { text: "Customer PO", style: "field" },
                { text: "TSR", style: "field" },
                { text: "CSR", style: "field" },
                { text: "", style: "field" },
              ],
              [
                { text: note.orderDate, style: "field" },
                { text: note.dispatchDate, style: "field" },

                { text: note.customer.code, style: "field" },
                { text: "TSR", style: "field" },
                { text: "CSR", style: "field" },
                { text: "", style: "field" },
              ],
            ],
          },
        },
        {
          canvas: [
            { type: "line", x1: 0, y1: -20, x2: 762, y2: -20, lineWidth: 1 }, //Bottom line
            { type: "line", x1: 1, y1: 0, x2: 1, y2: -20, lineWidth: 1 },
            { type: "line", x1: 761, y1: 0, x2: 761, y2: -20, lineWidth: 1 },
          ],
        },
        {
          style: "table2",
          layout: "Borders",
          table: {
            widths: [
              "10%",
              "20%",
              "10%",
              "10%",
              "10%",
              "10%",
              "10%",
              "10%",
              "10%",
            ],
            body: [
              [
                { text: "ITEM NUMBER", style: "field" },
                { text: "DESCRIPTION", style: "field" },
                { text: "SERIAL NO", style: "field" },
                { text: "U/M", style: "field" },
                { text: "KG", style: "field" },
                { text: "QTY ORDERED", style: "field" },
                { text: "BACK ORDERED", style: "field" },
                { text: "QTY SUPPLIED", style: "field" },
                { text: "QTY RECEIVED", style: "field" },
              ],
            ],
          },
        },

        {
          style: "table3",
          layout: "Borders",
          table: {
            widths: ["20%", "40%", "20%", "20%"],
            body: [
              [
                {
                  stack: [
                    { text: "TOTAL WEIGHT", style: "field" },
                    { text: note.weight, style: "field" },
                  ],
                },
                { text: " ", style: "field" },

                {
                  stack: [
                    { text: "TOTAL VOLUME ", style: "field" },
                    { text: calculateAmout(pet), style: "field" },
                  ],
                },
                {
                  stack: [
                    { text: "TOTAL QTY SUPPLIED", style: "field" },
                    { text: "1", style: "field" },
                  ],
                },
              ],
            ],
          },
        },

        {
          margin: [0, -180],
          layout: "Borders",
          table: {
            widths: ["20%", "20%", "20%", "20%", "20%"],
            body: [
              [
                { text: "DRIVERS SIGNATURE", style: "field" },
                { text: "STOREMEN SIGNATURE", style: "field" },
                { text: "RECEIVER SIGNATURE", style: "field" },

                { text: "TIME OF DAY", style: "field" },
                { text: "DATE RECEIVED", style: "field" },
              ],
              [
                {
                  image: note.deliveryDetails.driverSignature,
                  width: 50,
                  alignment: "center",
                },
                {
                  image: note.deliveryDetails.storemenSignature,
                  width: 50,
                  alignment: "center",
                },
                {
                  image: note.deliveryDetails.customerSignature,
                  width: 50,
                  alignment: "center",
                },
                {
                  text: moment(new Date()).add(2, "hours").format("HH:mm"),
                  style: "field",
                },
                {
                  text: moment(new Date()).format("DD/MM/YYYY"),
                  style: "field",
                },
              ],
            ],
          },
        },

        {
          margin: [0, 180],
          layout: "Borders",
          table: {
            widths: ["100%"],
            body: [
              [
                {
                  text: "For any queries on this delivery please contact customer services on 0860100480",
                  style: "field",
                },
              ],
              [
                {
                  stack: [
                    { text: "Notes:", style: "field" },
                    { text: " ", style: "field" },
                    {
                      text: ocupySpace(note.deliveryDetails.customNotes),
                      style: "field",
                    },
                  ],
                },
              ],
            ],
          },
        },
      ],
      styles: {
        info: {
          margin: [0, 10, 0, 20],
          fontSize: 18,
          color: "#D7CAC3",
          alignment: "center",
        },
        headLabel: {
          fontSize: 18,
          color: "#ffffff",
          alignment: "center",
          bold: true,
          fillColor: "#C3D7D6",
        },
        field: {
          fontSize: 5,
          alignment: "center",
          color: "black",
        },
        field2: {
          fontSize: 5,
          color: "black",
        },
        fieldBold: {
          fontSize: 5,
          color: "black",
          bold: true,
        },
        header: {
          margin: [0, 10, 0, 10],
          fontSize: 22,
          bold: true,
          color: "#C3D7D6",
          alignment: "center",
        },
        table: {
          margin: [0, 5, 0, 15],
        },
        table2: {
          margin: [0, 0, 0, 0],
        },
        table3: {
          margin: [0, 180],
        },
        signiture: {
          width: 50,
          alignment: "center",
        },
      },
      defaultStyle: {
        // alignment: 'justiSfy'
      },
    };

    pet.forEach((item) => {
      item.serials.forEach((serial) => {
        let x = [
          { text: item.cad, style: "field" },
          { text: item.cai, style: "field" },
          { text: serial.serial, style: "field" },
          { text: "U/M", style: "field" },
          { text: item.weight, style: "field" },
          { text: item.amount, style: "field" },
          { text: "0", style: "field" },
          { text: "1", style: "field" },
          { text: "1", style: "field" },
        ];
        docDefinition.content[5].table.body.push(x);
      });
    });
    resolve(docDefinition);
  });
}

function toDataUrl(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        return resolve(reader.result);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.send();
  });
}

function calculateAmout(orders) {
  let i = 0;
  orders.forEach((order) => {
    i += order.amount;
  });

  return i;
}
function ocupySpace(val) {
  if (val) {
    return val;
  } else {
    const x =
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n" +
      "                                                                  \n";

    console.log("spacesssssssssssssssssssssssssssssssss");
    return x;
  }
}

exports.operatorCheck = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("00 2 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return admin
      .firestore()
      .collection("dashboard-users")
      .where("type", "==", "Operator")
      .get()
      .then((operators) => {
        operators.forEach((operator) => {
          console.log(operator.data().key);
          return admin
            .firestore()
            .collection("dashboard-users")
            .doc(operator.data().key)
            .update({ opCheck: false });
        });
      });
  });

exports.completeCheckout = functions.firestore
  .document("inspections/{uid}")
  .onUpdate((change) => {
    const checkout = change.after.data();

    if (checkout.type === "checkout") {
      if (checkout.timeOut !== "") {
        // calc total duration

        getDuration(checkout).then(() => {
          changeChecks(checkout).then(() => {
            return console.log("Done");
          });
        });
      } else {
        return console.log("Not done");
      }
    } else if (checkout.type === "checkin") {
      assessEquipment(checkout);
    } else if (checkout.type === "workshop") {
      if (
        checkout.controllerSig !== "" &&
        checkout.controllerSig !== undefined
      ) {
        sendWorkshopEmail(checkout);
      }
    } else {
      return console.log("Inspection not checkout");
    }
  });

function getDuration(checkout) {
  return new Promise(function (resolve, reject) {
    console.log(checkout.key);
    admin
      .firestore()
      .collection("inspections")
      .where("type", "==", "checkin")
      .where("jobNo", "==", checkout.jobNo)
      .limit(1)
      .get()
      .then((checkins) => {
        checkins.forEach((check) => {
          console.log(check.data().key);
          var totalTimeIn = check.data().timeStamp;
          var timeStamp = moment(new Date().toISOString())
            .locale("en")
            .format("YYYY/MM/DD, HH:mm");
          var totalDur = moment(timeStamp, "YYYY/MM/DD, HH:mm").diff(
            moment(check.data().timeStamp, "YYYY/MM/DD, HH:mm"),
            "hours",
            true
          );
          console.log(totalDur);
          admin
            .firestore()
            .collection("inspections")
            .doc(checkout.key)
            .update({ totalTimeIn: totalTimeIn, totalDur: totalDur });
        });
        return resolve();
      });
  });
}

function changeChecks(checkout) {
  return new Promise(function (resolve, reject) {
    var check;
    if (checkout.truckCheck === "Small") {
      check = "Medium";
    } else if (checkout.truckCheck === "Medium") {
      check = "Large";
    } else if (checkout.truckCheck === "Large") {
      check = "Small";
    }
    admin
      .firestore()
      .collection("trucks")
      .doc(checkout.truckReg)
      .update({ checkType: check, timeStamp: "", jobNo: "" });
    if (checkout.trailer1Reg !== "") {
      if (checkout.trailer1Check === "Small") {
        check = "Medium";
      } else if (checkout.trailer1Check === "Medium") {
        check = "Large";
      } else if (checkout.trailer1Check === "Large") {
        check = "Small";
      }
      admin
        .firestore()
        .collection("trailers")
        .doc(checkout.trailer1Reg)
        .update({ checkType: check, jobNo: "" });
    }
    if (checkout.trailer2Reg !== "") {
      if (checkout.trailer2Check === "Small") {
        check = "Medium";
      } else if (checkout.trailer2Check === "Medium") {
        check = "Large";
      } else if (checkout.trailer2Check === "Large") {
        check = "Small";
      }
      admin
        .firestore()
        .collection("trailers")
        .doc(checkout.trailer2Reg)
        .update({ checkType: check, jobNo: "" });
    }
    return resolve();
  });
}

function assessEquipment(checkin) {
  if (checkin.controllerSig !== "" && checkin.controllerSig !== undefined) {
    return admin
      .firestore()
      .collection("inspections")
      .where("code", "==", checkin.code)
      .where("type", "==", "checkout")
      .orderBy("date", "desc")
      .limit(1)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          var checkout = doc.data();
          var deviations = [];
          if (checkout.traps !== checkin.traps) {
            deviations.push({
              equipment: "Tarps",
              checkout: checkout.traps,
              checkin: checkin.traps,
            });
          }
          if (checkout.netts !== checkin.netts) {
            deviations.push({
              equipment: "Netts",
              checkout: checkout.netts,
              checkin: checkin.netts,
            });
          }
          if (checkout.belts !== checkin.belts) {
            deviations.push({
              equipment: "Straps",
              checkout: checkout.belts,
              checkin: checkin.belts,
            });
          }
          if (checkout.ratchets !== checkin.ratchets) {
            deviations.push({
              equipment: "Ratchets",
              checkout: checkout.ratchets,
              checkin: checkin.ratchets,
            });
          }
          if (checkout.chains !== checkin.chains) {
            deviations.push({
              equipment: "Chains",
              checkout: checkout.chains,
              checkin: checkin.chains,
            });
          }
          if (checkout.satans !== checkin.satans) {
            deviations.push({
              equipment: "Satans",
              checkout: checkout.satans,
              checkin: checkin.satans,
            });
          }
          if (checkout.locks !== checkin.locks) {
            deviations.push({
              equipment: "Container Locks",
              checkout: checkout.locks,
              checkin: checkin.locks,
            });
          }
          if (checkout.uprights !== checkin.uprights) {
            deviations.push({
              equipment: "Up Rights",
              checkout: checkout.uprights,
              checkin: checkin.uprights,
            });
          }
          if (checkout.plate !== checkin.plate) {
            deviations.push({
              equipment: "Coil Deck Plate",
              checkout: checkout.plate,
              checkin: checkin.plate,
            });
          }
          if (checkout.fire !== checkin.fire) {
            deviations.push({
              equipment: "Fire Extinguisher",
              checkout: checkout.fire,
              checkin: checkin.fire,
            });
          }
          if (checkout.blocks !== checkin.blocks) {
            deviations.push({
              equipment: "Stop blocks",
              checkout: checkout.blocks,
              checkin: checkin.blocks,
            });
          }
          if (deviations.length !== 0) {
            return admin
              .firestore()
              .collection("inspections")
              .doc(checkin.key)
              .update({ deviations: deviations });
          } else {
            return;
          }
        });
      });
  }
}

exports.newWorkshopEmail = functions.firestore
  .document("newWorkshop/{uid}")
  .onCreate((change) => {
    const form = change.data();
    sendWorkshopEmail(form);
  });

function sendWorkshopEmail(workshop) {
  return workshopProcessPDF(workshop).then((bodies) => {
    return getLogos().then(function () {
      return workshopPDF(workshop, bodies).then((docDefinition) => {
        const file_name = `Workshop_Inspection/${workshop.truckFleetNo}.pdf`;
        return createPDF(docDefinition, file_name)
          .then(function (file_name) {
            const st = new Storage();
            const buck = st.bucket(BUCKET);
            return buck
              .file(file_name)
              .download()
              .then((data) => {
                const myPdf = data[0];
                return sendPdfEmail(myPdf, workshop);
              })
              .catch(function (error) {
                return console.error("Failed!" + error);
              });
          })
          .catch(function (error) {
            return console.error("Failed!" + error);
          });
      });
    });
  });
}

function workshopProcessPDF(workshop) {
  return new Promise(function (resolve) {
    var workshopBody = [];
    var workshopDeviations = [];
    if (workshop.checkType === "Small") {
      if (workshop.oil === true) {
        workshopBody.push([{ text: "Check oil level" }, { text: "Yes" }]);
      } else if (workshop.oil === false) {
        workshopBody.push([{ text: "Check oil level" }, { text: "No" }]);
      }
      if (workshop.coolant === true) {
        workshopBody.push([{ text: "Check coolant level" }, { text: "Yes" }]);
      } else if (workshop.coolant === false) {
        workshopBody.push([{ text: "Check coolant level" }, { text: "No" }]);
      }
      if (workshop.lights === true) {
        workshopBody.push([{ text: "Check lights" }, { text: "Yes" }]);
      } else if (workshop.lights === false) {
        workshopBody.push([{ text: "Check lights" }, { text: "No" }]);
      }
    } else if (workshop.checkType === "Medium") {
      if (workshop.engine === true) {
        workshopBody.push([
          { text: "Check engine water/oil leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.engine === false) {
        workshopBody.push([
          { text: "Check engine water/oil leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.gearbox === true) {
        workshopBody.push([
          { text: "Check Gearbox oil leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.gearbox === false) {
        workshopBody.push([
          { text: "Check Gearbox oil leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.propshafts === true) {
        workshopBody.push([{ text: "Check propshafts play" }, { text: "Yes" }]);
      } else if (workshop.propshafts === false) {
        workshopBody.push([{ text: "Check propshafts play" }, { text: "No" }]);
      }
      if (workshop.airbags === true) {
        workshopBody.push([
          { text: "Check spring packs/Air bags" },
          { text: "Yes" },
        ]);
      } else if (workshop.airbags === false) {
        workshopBody.push([
          { text: "Check spring packs/Air bags" },
          { text: "No" },
        ]);
      }
      if (workshop.brakes === true) {
        workshopBody.push([{ text: "Check Brakes" }, { text: "Yes" }]);
      } else if (workshop.brakes === false) {
        workshopBody.push([{ text: "Check Brakes" }, { text: "No" }]);
      }
      if (workshop.coolant === true) {
        workshopBody.push([
          { text: "Check engine oil and coolant level" },
          { text: "Yes" },
        ]);
      } else if (workshop.coolant === false) {
        workshopBody.push([
          { text: "Check engine oil and coolant level" },
          { text: "No" },
        ]);
      }
      if (workshop.windscreen === true) {
        workshopBody.push([
          { text: "Check Windscreen, windows and mirrors" },
          { text: "Yes" },
        ]);
      } else if (workshop.windscreen === false) {
        workshopBody.push([
          { text: "Check Windscreen, windows and mirrors" },
          { text: "No" },
        ]);
      }
      if (workshop.licence === true) {
        workshopBody.push([
          { text: "Check licence disc validity" },
          { text: "Yes" },
        ]);
      } else if (workshop.licence === false) {
        workshopBody.push([
          { text: "Check licence disc validity" },
          { text: "No" },
        ]);
      }
      if (workshop.defects === true) {
        workshopBody.push([
          { text: "Check reported defects" },
          { text: "Yes" },
        ]);
      } else if (workshop.defects === false) {
        workshopBody.push([{ text: "Check reported defects" }, { text: "No" }]);
      }
      if (workshop.lights === true) {
        workshopBody.push([{ text: "Check Lights" }, { text: "Yes" }]);
      } else if (workshop.lights === false) {
        workshopBody.push([{ text: "Check Lights" }, { text: "No" }]);
      }
    } else {
      if (workshop.radiator === true) {
        workshopBody.push([
          { text: "Check radiator and water pipes for leaks and damage" },
          { text: "Yes" },
        ]);
      } else if (workshop.radiator === false) {
        workshopBody.push([
          { text: "Check radiator and water pipes for leaks and damage" },
          { text: "No" },
        ]);
      }
      if (workshop.engine === true) {
        workshopBody.push([
          { text: "Check engine for oil and water leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.engine === false) {
        workshopBody.push([
          { text: "Check engine for oil and water leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.bellhousing === true) {
        workshopBody.push([
          { text: "Check bellhousing if secure" },
          { text: "Yes" },
        ]);
      } else if (workshop.bellhousing === false) {
        workshopBody.push([
          { text: "Check bellhousing if secure" },
          { text: "No" },
        ]);
      }
      if (workshop.gearbox === true) {
        workshopBody.push([
          { text: "Check gearbox for leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.gearbox === false) {
        workshopBody.push([
          { text: "Check gearbox for leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.propshafts === true) {
        workshopBody.push([
          { text: "Check propshafts if secure and excessive play" },
          { text: "Yes" },
        ]);
      } else if (workshop.propshafts === false) {
        workshopBody.push([
          { text: "Check propshafts if secure and excessive play" },
          { text: "No" },
        ]);
      }
      if (workshop.suspension === true) {
        workshopBody.push([
          { text: "Check suspension if secure (U-Bolts etc.)" },
          { text: "Yes" },
        ]);
      } else if (workshop.suspension === false) {
        workshopBody.push([
          { text: "Check suspension if secure (U-Bolts etc.)" },
          { text: "No" },
        ]);
      }
      if (workshop.tyre === true) {
        workshopBody.push([
          { text: "Check tyre wear and torque arms" },
          { text: "Yes" },
        ]);
      } else if (workshop.tyre === false) {
        workshopBody.push([
          { text: "Check tyre wear and torque arms" },
          { text: "No" },
        ]);
      }
      if (workshop.airbags === true) {
        workshopBody.push([
          { text: "Check air valves/air bags for leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.airbags === false) {
        workshopBody.push([
          { text: "Check air valves/air bags for leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.brakes === true) {
        workshopBody.push([
          { text: "Check brake shoes/pads and state percentage of life used" },
          { text: "Yes" },
        ]);
      } else if (workshop.brakes === false) {
        workshopBody.push([
          { text: "Check brake shoes/pads and state percentage of life used" },
          { text: "No" },
        ]);
      }
      if (workshop.diffs === true) {
        workshopBody.push([
          { text: "Check diffs/hubs for oil leaks" },
          { text: "Yes" },
        ]);
      } else if (workshop.diffs === false) {
        workshopBody.push([
          { text: "Check diffs/hubs for oil leaks" },
          { text: "No" },
        ]);
      }
      if (workshop.extOil === true) {
        workshopBody.push([{ text: "Truck Exterior" }, { text: "Yes" }]);
      } else if (workshop.extOil === false) {
        workshopBody.push([{ text: "Truck Exterior" }, { text: "No" }]);
      }
      if (workshop.extCoolant === true) {
        workshopBody.push([{ text: "Check coolant level" }, { text: "Yes" }]);
      } else if (workshop.extCoolant === false) {
        workshopBody.push([{ text: "Check coolant level" }, { text: "No" }]);
      }
      if (workshop.fluid === true) {
        workshopBody.push([
          { text: "Check other fluid levels and check all filler caps" },
          { text: "Yes" },
        ]);
      } else if (workshop.fluid === false) {
        workshopBody.push([
          { text: "Check other fluid levels and check all filler caps" },
          { text: "No" },
        ]);
      }
      if (workshop.windscreen === true) {
        workshopBody.push([
          { text: "Check windscreen for cracks and check wiper blades" },
          { text: "Yes" },
        ]);
      } else if (workshop.windscreen === false) {
        workshopBody.push([
          { text: "Check windscreen for cracks and check wiper blades" },
          { text: "No" },
        ]);
      }
      if (workshop.licence === true) {
        workshopBody.push([
          { text: "Check licence disc validity" },
          { text: "Yes" },
        ]);
      } else if (workshop.licence === false) {
        workshopBody.push([
          { text: "Check licence disc validity" },
          { text: "No" },
        ]);
      }
      if (workshop.defects === true) {
        workshopBody.push([
          { text: "Check and attend to all reported defects" },
          { text: "Yes" },
        ]);
      } else if (workshop.defects === false) {
        workshopBody.push([
          { text: "Check and attend to all reported defects" },
          { text: "No" },
        ]);
      }
      if (workshop.lights === true) {
        workshopBody.push([
          { text: "Check all lights and indicators" },
          { text: "Yes" },
        ]);
      } else if (workshop.lights === false) {
        workshopBody.push([
          { text: "Check all lights and indicators" },
          { text: "No" },
        ]);
      }
      if (workshop.reflectors === true) {
        workshopBody.push([
          { text: "Check reflectors and warning signs" },
          { text: "Yes" },
        ]);
      } else if (workshop.reflectors === false) {
        workshopBody.push([
          { text: "Check reflectors and warning signs" },
          { text: "No" },
        ]);
      }
      if (workshop.battery === true) {
        workshopBody.push([
          { text: "Check battery terminals and check if batteries are secure" },
          { text: "Yes" },
        ]);
      } else if (workshop.battery === false) {
        workshopBody.push([
          { text: "Check battery terminals and check if batteries are secure" },
          { text: "No" },
        ]);
      }
      if (workshop.chevron === true) {
        workshopBody.push([
          { text: "Check chevron/tail board" },
          { text: "Yes" },
        ]);
      } else if (workshop.chevron === false) {
        workshopBody.push([
          { text: "Check chevron/tail board" },
          { text: "No" },
        ]);
      }
    }
    workshopBody.push([{ text: "Notes" }, { text: workshop.notes }]);
    workshopBody.push([{ text: "Controller" }, { text: workshop.controller }]);
    workshopBody.push([
      { text: "Controller Signature" },
      { image: workshop.controllerSig, width: 100, alignment: "center" },
    ]);

    if (workshop.deviations) {
      if (workshop.deviations !== []) {
        if (workshop.deviations.length > 0) {
          workshopDeviations.push([
            { text: "Item" },
            { text: "Note" },
            { text: "Photo" },
          ]);
          workshop.deviations.forEach((dev) => {
            workshopDeviations.push([
              { text: dev.item },
              { text: dev.note },
              { text: " - " },
            ]);
          });
        } else {
          workshopDeviations.push([
            { text: "No Deviations", colSpan: 3 },
            {},
            {},
          ]);
        }
      }
    }
    var bodies = [];
    bodies.push(workshopBody);
    bodies.push(workshopDeviations);
    resolve(bodies);
  });
}

function workshopPDF(report, bodies) {
  return new Promise(function (resolve) {
    var km = 0;
    admin
      .firestore()
      .collection("trucks")
      .doc(report.code)
      .get()
      .then((trck) => {
        var truck = trck.data();
        if (truck) {
          km = truck.KM;
        } else {
          km = " - ";
        }
      })
      .then(() => {
        var docDefinition = {
          pageOrientation: "landscape",
          content: [
            {
              style: "table2",
              table: {
                widths: ["25%", "50%", "25%"],
                body: [
                  [
                    {
                      image: logoPremier,
                      width: 150,
                      alignment: "center",
                      rowSpan: 2,
                    },
                    {
                      text: "\nPREMIER LOGISTICS SOLUTIONS\n",
                      style: "header",
                    },
                    {
                      text: `Document Number\n ${report.jobNo}\n Revision Number/Date\n 01 / ${report.date}\n Page Number \nPage 1 of 1`,
                      rowSpan: 2,
                      style: "header2",
                    },
                  ],
                  [{}, { text: "\nJob Card", style: "header" }, {}],
                ],
              },
            },
            {
              table: {
                widths: ["50%", "50%"],
                body: [
                  [
                    [
                      {
                        style: "table",
                        table: {
                          widths: ["25%", "25%", "25%", "25%"],
                          body: [
                            [
                              { text: "Fleet:", style: "headLabel" },
                              { text: report.truckFleet, alignment: "center" },
                              { text: "Fleet Number:", style: "headLabel" },
                              {
                                text: report.truckFleetNo,
                                alignment: "center",
                              },
                            ],
                            [
                              { text: "Registration:", style: "headLabel" },
                              { text: report.code, alignment: "center" },
                              { text: "", style: "headLabel" },
                              { text: "", alignment: "center" },
                            ],
                            [
                              { text: "KM:", style: "headLabel" },
                              { text: km, alignment: "center" },
                              { text: "Date:", style: "headLabel" },
                              {
                                text: report.date,
                                alignment: "center",
                              },
                            ],
                            [
                              { text: "Time In:", style: "headLabel" },
                              { text: report.timeIn, alignment: "center" },
                              { text: "Time Out:", style: "headLabel" },
                              { text: report.timeOut, alignment: "center" },
                            ],
                          ],
                        },
                      },
                      {
                        style: "table2",
                        table: {
                          widths: ["50%", "50%"],
                          height: 100,
                          body: bodies[0],
                        },
                      },
                      {
                        style: "table2",
                        table: {
                          widths: ["33%", "33%", "34%"],
                          height: 100,
                          body: bodies[1],
                        },
                      },
                    ],
                    [
                      {
                        style: "table3",
                        table: {
                          widths: ["25%", "35%", "15%", "25%"],
                          height: 100,
                          body: [
                            [
                              {
                                text: "REPAIRS DONE",
                                colSpan: 4,
                                alignment: "center",
                              },
                              {},
                              {},
                              {},
                            ],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [{ text: ".", colSpan: 4 }, {}, {}, {}],
                            [
                              { text: "UNITS", alignment: "center" },
                              { text: "PARTS USED", alignment: "center" },
                              { text: "UNIT PRICE", alignment: "center" },
                              { text: "COST", alignment: "center" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "Sundries", alignment: "center" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "Engine Oil 15W40", alignment: "center" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "Soft Grease EP2", alignment: "center" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "" },
                              { text: "Labour", alignment: "center" },
                              { text: "" },
                              { text: "R                                  -" },
                            ],
                            [
                              { text: "  - " },
                              { text: "  -  " },
                              { text: "  - " },
                              { text: "R                                  -" },
                            ],
                          ],
                        },
                      },
                    ],
                  ],
                ],
              },
              layout: "noBorders",
            },
          ],
          styles: {
            headLabel: {
              color: "#123d82",
              bold: true,
              fontSize: 9,
            },
            header: {
              color: "#123d82",
              fontSize: 12,
              bold: true,
              alignment: "center",
            },
            header2: {
              color: "#123d82",
              fontSize: 10,
              bold: true,
              alignment: "center",
            },
            notes: {
              margin: [0, 20, 0, 20],
            },
            subheader: {
              alignment: "center",
              color: "#123d82",
              fontSize: 14,
              bold: true,
              margin: [0, 15, 0, 5],
            },
            table: {
              margin: [0, 5, 0, 15],
            },
            table2: {
              fontSize: 5,
            },
            table3: {
              margin: [0, 5, 0, 15],
              fontSize: 5,
            },
            tableHeader: {
              bold: true,
              fontSize: 13,
              color: "black",
            },
          },
          defaultStyle: {
            // alignment: 'justiSfy'
          },
        };
        resolve(docDefinition);
      });
  });
}

function createPDF(docDefinition, file_name) {
  return new Promise(function (resolve, reject) {
    const fontDescriptors = {
      Roboto: {
        normal: "fonts/Roboto-Regular.ttf",
        bold: "fonts/Roboto-Bold.ttf",
        italics: "fonts/Roboto-Italic.ttf",
        bolditalics: "fonts/Roboto-BoldItalic.ttf",
      },
    };
    const printer = new PdfPrinter(fontDescriptors);
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const storage = new Storage({
      projectId: "premier-logistics",
    });
    const myPdfFile = storage.bucket(BUCKET).file(file_name);

    pdfDoc
      .pipe(myPdfFile.createWriteStream())
      .on("finish", function () {
        resolve(file_name);
      })
      .on("error", function (error) {
        return console.error("Failed!" + error);
      });

    pdfDoc.end();
  });
}

function sendPdfEmail(myPdf, report) {
  const mailOptions = {
    from: '"PLS: Workshop" <dashalert@plsolutions.co.za>',
    to: "mannyr@plsolutions.co.za",
    subject: `Workshop Inspection: ${report.truckFleetNo}`,
    text: `Good Day,\n\nPlease find attached recent workshop inspection.\n\nKindly,\nPLS Team`,
    attachments: [
      {
        filename: `Workshop_Inspection_${report.truckFleetNo}.pdf`,
        content: myPdf,
        contentType: "application/pdf",
      },
    ],
  };
  return mailTransport
    .sendMail(mailOptions)
    .then(() => console.log(`Email Sent`))
    .catch(function (error) {
      return console.error("Failed!" + error);
    });
}

exports.uploadExcel = functions.firestore
  .document("imports/{uid}")
  .onCreate((change) => {
    const doc = change.data();

    const result = excelToJson({
      source: doc.url,
    });

    return console.log(result);
  });

function autoCustEmails(order) {
  admin
    .firestore()
    .collection("clients")
    .where("type", "==", "Customer")
    .where("autoEmail", "==", true)
    .get()
    .then((custs) => {
      custs.forEach((cust) => {
        cust.data().consignees.forEach((place) => {
          if (place.name === order.endPos.name) {
            sendCustEmail(cust.data().email, order);
          }
        });
      });
    });
}

function sendCustEmail(email, order) {
  const mailOptions = {
    from: '"Michelin Orders" <support@michelin.co.za>',
    to: email,
    subject: "Michelin Order Proof Of Delivery",
    text: `Good Day,\n\nPlease find attached the Proof of Delivery for order ${order.delNote}.\n\nKindly,\nMichelin Team`,
    attachments: [
      {
        filename: `${order.delNote}.pdf`,
        path: order.pod,
      },
    ],
  };
  return mailTransport
    .sendMail(mailOptions)
    .then(() => console.log(`Sent`))
    .catch(function (error) {
      return console.error(
        "There was an error while sending the email:",
        error
      );
    });
}

exports.emailCust = functions.firestore
  .document("customerEmails/{uid}")
  .onCreate((snap) => {
    const info = snap.data();

    const mailOptions = {
      from: '"Michelin Orders" <support@michelin.co.za>',
      to: info.customerEmail,
      subject: "Michelin Order Proof Of Delivery",
      text: `Good Day,\n\nPlease find attached the Proof of Delivery for order ${info.delNote}.\n\nKindly,\nMichelin Team`,
      attachments: [
        {
          filename: `${info.delNote}.pdf`,
          path: info.pod,
        },
      ],
    };
    return mailTransport
      .sendMail(mailOptions)
      .then(() => console.log(`Sent`))
      .catch(function (error) {
        return console.error(
          "There was an error while sending the email:",
          error
        );
      });
  });

exports.removeCustEmail = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("* * * * 1")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return new Promise((resolve, reject) => {
      admin
        .firestore()
        .collection("customerEmails")
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            admin
              .firestore()
              .collection("customerEmails")
              .doc(doc.data().key)
              .delete();
          });
        });
    });
  });

exports.testingPOST = functions
  .runWith(runtimeOpts)
  .https.onRequest((req, res) => {
    var msg = JSON.stringify("post worked");
    res.set({ "Access-Control-Allow-Origin": "*" });

    var axios = require("axios");

    var config = {
      method: "get",
      url: `https://api.autotraklive.com/vehicleposition/GetVehiclePositionsByRegistration/${reg}`,
      headers: {
        Authorization:
          "Basic MzAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42",
      },
    };

    axios(config)
      .then(function (response) {
        var apiresults = response.data;
        if (apiresults.length !== 0) {
          msg = JSON.stringify("pass");
          return res.send(msg);
        } else {
          msg = JSON.stringify("fail");
          return res.send(msg);
        }
      })
      .catch(function (error) {
        msg = JSON.stringify("fail");
        return res.send(msg);
      });
  });

exports.checkAutotrak = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("15 11 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return new Promise((resolve, reject) => {
      var dbTrucks = [];
      var auto = [];
      var got = [];
      var missing = [];
      admin
        .firestore()
        .collection("trucks")
        .get()
        .then((trucks) => {
          trucks.forEach((truck) => {
            dbTrucks.push(truck.data());
          });
          getAutotrakVehicles().then(function (results) {
            for (var i = 0; i < dbTrucks.length; i++) {
              var reg = dbTrucks[i].fleetNo + "-" + dbTrucks[i].registration;
              var code = dbTrucks[i].registration;
              var fleetNo = dbTrucks[i].fleetNo;
              var found = false;
              for (var j = 0; j < results.length; j++) {
                if (results[j].Registration === reg) {
                  found = true;
                }
                if (i === 0) {
                  auto.push({ reg: results[j].Registration });
                }
              }
              if (found === true) {
                got.push({ reg: reg, code: code, fleetNo: fleetNo });
              } else {
                missing.push({ reg: reg, code: code, fleetNo: fleetNo });
              }
            }
            console.log(auto);
            admin
              .firestore()
              .collection("autoTrak")
              .add({ got: got, missing: missing, auto: auto });
            return console.log("Done");
          });
        });
    });
  });

function getAutotrakVehicles() {
  return new Promise((resolve, reject) => {
    var axios = require("axios");

    var config = {
      method: "get",
      url: "https://api.autotraklive.com/vehicle/GetVehicles",
      headers: {
        Authorization:
          "Basic MTAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42",
      },
    };

    axios(config)
      .then(function (response) {
        //console.log(JSON.stringify(response.data));
        resolve(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

/*

exports.economyCalc = functions.runWith(runtimeOpts).pubsub.schedule('10 08 * * *').timeZone('Africa/Johannesburg').onRun(() => {
    return new Promise((resolve, reject) => {

        var fuelEco = 0;
        const date = moment(new Date().toISOString()).locale('en').format('DD-MM-YYYY');
        const time = moment(new Date().toISOString()).locale('en').format('HH:mm');
        admin.firestore().collection('fuel-economy').doc(date).set({
            date: date,
            time: time,
            fuelEco: fuelEco
        })

        return admin.firestore().collection('trucks').get().then(trucks => {
            trucks.forEach(truck => {
                admin.firestore().collection(`trucks/${truck.data().registration}/fuel-economy`).orderBy('date', 'desc').orderBy('time', 'desc').limit(1).get().then(items => {
                    items.forEach(item => {
                        if (item.data().fuelEco) {
                            console.log(item.data().fuelEco)
                            fuelEco = fuelEco + item.data().fuelEco;
                            admin.firestore().collection('fuel-economy').doc(date).update({
                                fuelEco: fuelEco
                            })
                        }
                    })
                }).catch(function (error) {
                    return console.error(error);
                });
            })

        }).catch(function (error) {
            return console.error(error);
        });
    })
})



// Generate code for all the added Vehicles

exports.codeGenerator = functions.runWith(runtimeOpts).https.onRequest((req, res) => {

    res.set({ 'Access-Control-Allow-Origin': '*' })

    admin.firestore().collection('trucks').get().then(trucks => {
        trucks.forEach(truck => {
            var item = {
                code: truck.data().registration,
                type: 'trucks'
            }
            admin.firestore().collection('codes').doc(item.code).set(item);
        })
        return console.log('Done')
    }).catch(function (error) {
        return console.error(error);
    });

    return res.end;

})
*/

// sets a geoFence with a 500m Radius and saves boundaries to firebase.
// exports.setGeofence = functions.runWith(runtimeOpts).pubsub.schedule('every 10 minutes').timeZone('Africa/Johannesburg').onRun(() => {
//     return admin.firestore().collection('destinations').get().then(destinations => {
//         destinations.forEach(dest => {
//             if (dest.data().lat && dest.data().lng) {
//                 var lat = dest.data().lat;
//                 var lng = dest.data().lng;
//                 admin.firestore().collection('destinations').doc(dest.data().key).update({
//                     latUpper: lat + 0.0045, latLower: lat - 0.0045, lngLeft: lng - 0.0045, lngRight: lng + 0.0045,
//                 })
//             }
//         })
//     })
// })
// -------------------------------------------------------------

//     geoFence().then(function (fence) {
//         console.log("this is the fence",fence)
//         getLoc().then(function (results) {
//             if (results.length !== 0) {
//                 var currentLat = results[0].lat;
//                 var currentLng = results[0].lon;
//                 console.log("trucks Location:", currentLat, currentLng)
//                 if (currentLat <= fence.latUpper && currentLat >= fence.latLower) {
//                     console.log("In latitude")
//                 }
//                 if (currentLng <= fence.lngRight && currentLng >= fence.lngLeft) {
//                     console.log("In longitude")
//                 }
//             }
//         })
//     })
// })

// function geoFence(){
//     return new Promise(function (resolve, reject) {
//         let lat = -26.549910596150543;
//         let lng = 28.007532557669506;
//         var fence = { latUpper: lat + 0.0045, latLower: lat - 0.0045, lngLeft:lng - 0.0045, lngRight:lng + 0.0045, }
//         resolve(fence);
//     })
// }

exports.getLoc = functions.runWith(runtimeOpts).https.onRequest((req, res) => {
  var axios = require("axios");
  res.set({ "Access-Control-Allow-Origin": "*" });
  //let body = JSON.parse(req.body)
  console.log("req:", req.body);
  var regg = JSON.stringify(req.body);
  var reg = JSON.parse(req.body);
  var axios = require("axios");
  console.log("reg:", reg);
  console.log("regg:", regg);

  var config = {
    method: "get",
    url: `https://api.autotraklive.com/vehicleposition/GetVehiclePositionsByRegistration/${reg}`,
    headers: {
      Authorization:
        "Basic MzAxOmV4cG9ydEBpbm5vdmF0aXZldGhpbmtpbmc6IW5OMFY0N2l2M3QjMW5rIW42",
    },
  };

  axios(config)
    .then(function (response) {
      console.log("results: ", JSON.stringify(response.data));
      var results = JSON.stringify(response.data);
      res.set({ "Access-Control-Allow-Origin": "*" });
      return res.send(results);
    })
    .catch(function (error) {
      console.log("error:", error);
    });
});

exports.SABtracking = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 2 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var timeArv = moment(new Date().toISOString())
      .locale("en")
      .add(2, "hours")
      .format("YYYY/MM/DD, HH:mm");
    console.log(timeArv);
    destinationList().then(function (list) {
      //console.log("list resolved", list.length)
      trucksLoop(list).then(function (res) {
        console.log(res);
      });
    });
  });

function trucksLoop(list) {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("trucks")
      .where("tracking", "==", true)
      .where("fleet", "==", "SAB")
      .get()
      .then((trucks) => {
        const len = trucks.docs.length;
        //console.log(len)
        let i = 0;
        trucks.docs.forEach((truck) => {
          i = ++i;
          if (truck.data().code && truck.data().fleetNo) {
            getLocation(truck.data()).then((results) => {
              if (results.length !== 0) {
                console.log("results: ", JSON.stringify(results[0]));
                //console.log("we have location results")
                checkLocation(truck.data(), results[0], list);
              }
            });
          }
        });
        if (i == len) {
          let done = "complete";
          resolve(done);
        }
      });
  });
}

function destinationList() {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("destinations")
      .orderBy("latUpper")
      .get()
      .then((destinations) => {
        var destList = [];
        const len = destinations.docs.length;
        let i = 0;
        destinations.docs.forEach((dest) => {
          destList.push(dest.data());
          i = ++i;
        });
        if (i == len) {
          let list = destList;
          resolve(list);
        }
        // let list = destList;

        // Promise.all(list)
        // return resolve(list);
      });
  });
}

function checkLocation(loc1, loc2, list) {
  //console.log("check stop triggered")
  return new Promise((resolve, reject) => {
    //loc1.lat !== "" && loc1.lng !== ""
    if (loc1.lat && loc1.lng) {
      //console.log("triggered IF")
      // return resolve();

      var lat1 = loc1.lat.toFixed(5);
      var lng1 = loc1.lng.toFixed(5);
      var lat2 = loc2.lat.toFixed(5);
      var lng2 = loc2.lon.toFixed(5);
      var speed = loc2.speed;

      if (speed === 0) {
        // checkDepo(loc2, list).then(results => {
        //     console.log("check geofence results", results)
        //     console.log("speed is 0")
        //     resolve();
        // })
        if (lat2 !== lat1 || lng2 !== lng1) {
          //indicates truck has recently stopped
          checkDepo(loc2, list).then((results) => {
            console.log("check geofence results", results);
            if (
              results.arrived === true &&
              loc1.status !== "arrived" &&
              results.destination.name === loc1.destination.name
            ) {
              console.log(
                "in a geo-fence",
                loc1.code,
                results.destination.name
              );
              if (!loc1.timeArrived || loc1.timeArrived === "") {
                var timeArv = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
              } else {
                var timeArv = loc1.timeArrived;
              }
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeArrived: timeArv,
                status: "arrived",
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
                location: results.destination,
              });
              return resolve();
              //indicates truck has recently stopped at the depo/ the truck could still be driving around depo
              // we only want to update arival time once
              // indicates truck is at a known destination
              // update status -> arrived/loading
              // check truck is at the right destination ****
              // update origin -- need to do still****
              // track loading time -- need to do still****
            }
            if (
              results.arrived === true &&
              loc1.status !== "incorrect-destination" &&
              results.destination.name !== loc1.destination.name
            ) {
              // we know that we are at the wrong destination
              // will alert the controller
              var time = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              admin
                .firestore()
                .collection("trucks")
                .doc(loc1.code)
                .update({
                  timeArrived: time,
                  status: "incorrect-destination",
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                  location: results.destination,
                  alert: {
                    reason: "The truck is at the incorrect destination",
                    action: "Contact Driver",
                    resolved: false,
                  },
                });
              return resolve();
            }
            if (
              (results.arrived === true &&
                loc1.status === "arrived" &&
                loc1.timeArrived) ||
              (results.arrived === true &&
                loc1.status === "incorrect-destination" &&
                loc1.timeArrived)
            ) {
              console.log("busy loading");
              var timeArved = loc1.timeArrived;
              var timeNow = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              var duration = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                moment(timeArved, "YYYY/MM/DD, HH:mm"),
                "minutes",
                true
              );
              console.log("busy loading", loc1.code, duration);
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeLoading: duration,
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
              });
              return resolve();
            }

            if (results.arrived === false) {
              if (loc1.status === "in-queue") {
                var timeStopped = loc1.timeQueue;
                var timeNow = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
                var totalDur = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                  moment(timeStopped, "YYYY/MM/DD, HH:mm"),
                  "minutes",
                  true
                );
                admin.firestore().collection("trucks").doc(loc1.code).update({
                  stopDuration: totalDur,
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                });
                return resolve();
              } else if (loc1.status !== "in-queue") {
                console.log("stopped outside a geo-fence", loc1.code);
                var time = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
                //still calc ETA
                admin.firestore().collection("trucks").doc(loc1.code).update({
                  timeStop: time,
                  status: "slow-movement",
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                });
                return resolve();
              }
              //indicates truck is NOT at a known destination
              // start tracking stoppage time from not => set new stoppage time as it moved forward from last stop
              // update status -> unknown stop
            }
          });
        }
        if (lat2 === lat1 && lng2 === lng1) {
          //  indicates truck is still stationary since last check
          checkDepo(loc2, list).then((results) => {
            // first ifs to check that the status has been updated
            if (
              results.arrived === true &&
              loc1.status !== "arrived" &&
              results.destination.name === loc1.destination.name
            ) {
              console.log(
                "in a geo-fence for first time",
                loc1.code,
                results.destination.name
              );
              //indicates truck is at a known destination for the first time
              // update status
              // update location
              // track loading time
              if (!loc1.timeArrived || loc1.timeArrived === "") {
                var timeArv = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
              } else {
                var timeArv = loc1.timeArrived;
              }
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeArrived: timeArv,
                status: "arrived",
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
                location: results.destination,
              });
              return resolve();
            } else if (
              results.arrived === true &&
              loc1.status !== "incorrect-destination" &&
              results.destination.name !== loc1.destination.name
            ) {
              // we know that we are at the wrong destination
              // will alert the controller
              var time = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              admin
                .firestore()
                .collection("trucks")
                .doc(loc1.code)
                .update({
                  timeArrived: time,
                  status: "incorrect-destination",
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                  location: results.destination,
                  alert: {
                    reason: "The truck is at the incorrect destination",
                    action: "Contact Driver",
                    resolved: false,
                  },
                });
              return resolve();
            }

            //if to start tracking loading time.
            else if (
              (results.arrived === true &&
                loc1.status === "arrived" &&
                loc1.timeArrived) ||
              (results.arrived === true &&
                loc1.status === "incorrect-destination" &&
                loc1.timeArrived)
            ) {
              console.log("busy loading");
              var timeArved = loc1.timeArrived;
              var timeNow = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              var duration = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                moment(timeArved, "YYYY/MM/DD, HH:mm"),
                "minutes",
                true
              );
              console.log("busy loading", loc1.code, duration);
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeLoading: duration,
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
              });
              return resolve();

              // //indicates truck is at the right distination and we can calc loading time a known destination
              // // console.log("arrived inside a geo-fence", loc1.code, results.destination)
              // // if (loc1.destination && loc1.destination !== '') {
              // //     //indicates truck has been alocated an end destination
              // //     if (loc1.location === loc1.destination.name) {
              // //         // we know we at the right destination
              // //         // start calculating loading time
              // //         var timeArved = loc1.timeArrived;
              // //         var timeNow = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm');
              // //         var duration = moment(timeNow, 'YYYY/MM/DD, HH:mm').diff(moment(timeArved, 'YYYY/MM/DD, HH:mm'), 'minutes', true);
              // //         admin.firestore().collection('trucks').doc(loc1.code).update({
              // //             timeLoading: duration,
              // //             lat: loc2.lat,
              // //             lng: loc2.lon,
              // //         })
              // //         return resolve();
              // //     }
              // if (loc1.location !== loc1.destination.name) {
              //     // we know that we are at the wrong destination
              //     // will alert the controller
              //     var time = moment(new Date().toISOString()).locale('en').format('YYYY/MM/DD, HH:mm');
              //     admin.firestore().collection('trucks').doc(loc1.code).update({
              //         timeArrived: time,
              //         status: "incorrect-destination",
              //         lat: loc2.lat,
              //         lng: loc2.lon,
              //         address: loc2.address,
              //         alert: {
              //             reason: 'The truck is at the incorrect destination',
              //             action: "Contact Driver",
              //             resolved: false
              //         }
              //     });
              //     return resolve();
              // }
            } else if (
              (results.arrived === true && !loc1.destination) ||
              (results.arrived === true && loc1.destination === "")
            ) {
              console.log(
                "in a geo-fence but has no destination",
                loc1.code,
                results.destination.name
              );
              // No destination has been assigned so we assume that the current stop position is the end destination
              var timeArv = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeArrived: timeArv,
                status: "arrived",
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
                location: results.destination,
                destination: results.destination,
              });
              return resolve();
            } else if (results.arrived === false && loc1.timeStop) {
              //check here again if truck status is in-que
              if (loc1.status === "in-queue") {
                var timeStopped = loc1.timeQueue;
                var timeNow = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
                var totalDur = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                  moment(timeStopped, "YYYY/MM/DD, HH:mm"),
                  "minutes",
                  true
                );
                admin.firestore().collection("trucks").doc(loc1.code).update({
                  stopDuration: totalDur,
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                });
                return resolve();
              } else if (loc1.status !== "in-queue") {
                // indicates truck is NOT at a known destination
                // start tracking stoppage time
                // will alert operator after 5 minutes that the truck is making a unknown stop.
                var timeStopped = loc1.timeStop;
                var timeNow = moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD, HH:mm");
                var totalDur = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                  moment(timeStopped, "YYYY/MM/DD, HH:mm"),
                  "minutes",
                  true
                );
                console.log(
                  "stopped outside a geo-fence for a long period",
                  totalDur,
                  "minutes",
                  loc1.code
                );
                if (totalDur >= 5.0 && loc1.stopAlert !== false) {
                  admin
                    .firestore()
                    .collection("trucks")
                    .doc(loc1.code)
                    .update({
                      stopDuration: totalDur,
                      status: "unknown-stop",
                      lat: loc2.lat,
                      lng: loc2.lon,
                      address: loc2.address,
                      alert: {
                        reason:
                          "This truck has stopped outside a known location",
                        action: "Alert Authorities",
                        resolved: false,
                      },
                    });
                  return resolve();
                } else if (totalDur >= 5.0 && loc1.stopAlert === false) {
                  admin.firestore().collection("trucks").doc(loc1.code).update({
                    stopDuration: totalDur,
                    status: "unknown-stop",
                    lat: loc2.lat,
                    lng: loc2.lon,
                    address: loc2.address,
                  });
                  return resolve();
                }
              }
            } else if (results.arrived === false && !loc1.timeStop) {
              var time = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              admin.firestore().collection("trucks").doc(loc1.code).update({
                timeStop: time,
                status: "slow-movement",
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
              });
              return resolve();
            }
          });
        }
      } else if (speed !== 0) {
        // checkDepo(loc2, list).then(results => {
        //     console.log("check geofence results", results)
        //     console.log("speed is bigger than 0")
        //     resolve();
        // })
        checkDepo(loc2, list).then((results) => {
          //checks if the truck is still in the yard or not
          // yes ---> do nothing yet
          // No --> if recently left depo --> clear destination and save the previous trip details
          // No --> if recently on-route do we have a destination ?Yes --> Calc ETA,,,, No  --> Alert the controller
          if (results.arrived === false) {
            console.log("moving outside of geofence", loc1.code);
            if (
              loc1.status === "unknown-stop" ||
              loc1.status === "slow-movement" ||
              loc1.status === "" ||
              !loc1.status
            ) {
              if (loc1.alertList) {
                var alertLists = loc1.alertList;
              }
              if (!loc1.alertList || !loc1.alertList === undefined) {
                var alertLists = [];
              }
              if (loc1.alert) {
                alertLists.push(loc1.alert);
              }
              // indicates truck is moving again after stop an unkown stop
              // check if it has a destination YES--> calc ETA      NO --> change status + alert controller
              if (loc1.destination === "") {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(loc1.code)
                  .update({
                    status: "en-route",
                    lat: loc2.lat,
                    lng: loc2.lon,
                    address: loc2.address,
                    stopAlert: true,
                    alertList: alertLists,
                    alert: {
                      reason:
                        "This truck is on route and does not have an assigned destination",
                      action: "Assign Destination",
                      resolved: false,
                    },
                  });
                return resolve();
              }

              if (loc1.destination != "" && loc1.destination.name !== "None") {
                return graphETA(loc1, loc2).then((results) => {
                  console.log("got EAT from GRaph hopper", results);
                  if (results.paths[0]) {
                    var dist = results.paths[0].distance / 1000;
                    let distance = Math.round(dist * 100) / 100;
                    let tim = results.paths[0].time / 60000;
                    let eta = Math.round(tim * 100) / 100;
                    var hrs = tim / 60;
                    var rhrs = Math.floor(hrs);
                    var minutes = (hrs - rhrs) * 60;
                    var rminutes = Math.round(minutes);
                    let duration = rhrs + " hour(s) " + rminutes + " mins";
                    admin
                      .firestore()
                      .collection(`trucks`)
                      .doc(loc1.code)
                      .update({
                        estDist: distance,
                        estTime: duration,
                        eta: eta,
                        alertList: alertLists,
                        status: "en-route",
                        stopAlert: true,
                        lat: loc2.lat,
                        lng: loc2.lon,
                        address: loc2.address,
                      });
                    return resolve();
                  }
                });
                // return graphETA(loc1, loc2).then(results => {
                //     console.log("graph results: ", JSON.stringify(results));
                // })
                // en route and has a destination
                //calcETA(loc1, loc2);
                // return graphETA(loc1, loc2).then(results => {
                //     admin.firestore().collection(`trucks`).doc(loc1.code).update({
                //         estDist: results.paths.distance,
                //         eta: results.paths.time,
                //         status: "en-route",
                //         lat: loc2.lat,
                //         lng: loc2.lon,
                //     });
                //     console.log("graph results: ", JSON.stringify(results));
                // });
              }
            }

            if (loc1.status === "in-queue") {
              var timeStopped = loc1.timeQueue;
              var timeNow = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              var totalDur = moment(timeNow, "YYYY/MM/DD, HH:mm").diff(
                moment(timeStopped, "YYYY/MM/DD, HH:mm"),
                "minutes",
                true
              );
              admin.firestore().collection("trucks").doc(loc1.code).update({
                stopDuration: totalDur,
                lat: loc2.lat,
                lng: loc2.lon,
                address: loc2.address,
              });
              return resolve();
            }

            if (loc1.status === "incorrect-destination") {
              if (loc1.alertList) {
                console.log("has previous list");
                var alertList = loc1.alertList;
              }
              if (!loc1.alertList || !loc1.alertList === undefined) {
                var alertList = ["none"];
              }
              if (loc1.requiredETA) {
                var requiredETA = loc1.requiredETA;
              }
              if (!loc1.requiredETA || !loc1.requiredETA === undefined) {
                var requiredETA = "";
              }
              if (loc1.driver2) {
                var driver2 = loc1.driver2;
              }
              if (!loc1.driver2) {
                var driver2 = "";
              }
              if (loc1.alert) {
                alertList.push(loc1.alert);
              }
              if (loc1.shipmentNo) {
                var shipmentNo = loc1.shipmentNo;
              }
              if (!loc1.shipmentNo) {
                var shipmentNo = "Not Set";
              }
              if (loc1.timeQueue) {
                var timeQueue = loc1.timeQueue;
              }
              if (!loc1.shipmentNo) {
                var timeQueue = "N/A";
              }
              //indicates truck is moving from a known destination
              var timeExt = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              var docID = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("DDMMYYYY-HH:mm:ss");
              var date = moment(new Date().toISOString())
                .locale("en")
                .format("YYYY-MM-DD");
              admin
                .firestore()
                .collection("trips")
                .doc(docID)
                .set({
                  key: docID,
                  origin: loc1.origin,
                  destination: loc1.location,
                  code: loc1.code,
                  driver: loc1.driver,
                  date: date,
                  fleetNo: loc1.fleetNo,
                  timeStart: loc1.timeStart,
                  timeArrived: loc1.timeArrived,
                  timeExit: timeExt,
                  timeQueue: timeQueue,
                  error: "incorrect-destination",
                  alertList: alertList,
                  requiredETA: requiredETA,
                  driver2: driver2,
                  shipmentNo: shipmentNo,
                })
                .then(() => {
                  if (loc1.destination2) {
                    admin
                      .firestore()
                      .collection("trucks")
                      .doc(loc1.code)
                      .update({
                        timeStart: timeExt,
                        status: "en-route",
                        lat: loc2.lat,
                        lng: loc2.lon,
                        address: loc2.address,
                        origin: loc1.destination,
                        alertList: "",
                        alert: "",
                        destination: loc1.destination2,
                        destination2: "",
                        timeLoading: "",
                        timeStop: "",
                        timeArrived: "",
                        timeQueue: "",
                        requiredETA: "",
                        shipmentNo: "",
                        stopAlert: true,
                        estDist: 0,
                        estTime: 0,
                        eta: 0,
                      });
                    return resolve();
                  } else {
                    admin
                      .firestore()
                      .collection("trucks")
                      .doc(loc1.code)
                      .update({
                        timeStart: timeExt,
                        status: "en-route",
                        lat: loc2.lat,
                        lng: loc2.lon,
                        address: loc2.address,
                        origin: loc1.location,
                        alertList: "",
                        alert: {
                          reason:
                            "This truck is on route and does not have an assigned destination",
                          action: "Assign Destination",
                          resolved: false,
                        },
                        destination: "",
                        timeLoading: "",
                        timeStop: "",
                        timeArrived: "",
                        timeQueue: "",
                        requiredETA: "",
                        shipmentNo: "",
                        stopAlert: true,
                        estDist: 0,
                        estTime: 0,
                        eta: 0,
                      });
                    return resolve();
                  }
                });
            }

            if (loc1.status === "arrived") {
              // indicateds the truck recently left the depo if status hasn't changed yet.
              // truck needs to be assigned a new destination
              if (loc1.alertList) {
                console.log("has previous list");
                var alertList = loc1.alertList;
              }
              if (!loc1.alertList || !loc1.alertList === undefined) {
                var alertList = ["none"];
              }
              if (loc1.requiredETA) {
                var requiredETA = loc1.requiredETA;
              }
              if (!loc1.requiredETA || !loc1.requiredETA === undefined) {
                var requiredETA = "";
              }
              if (loc1.driver2) {
                var driver2 = loc1.driver2;
              }
              if (!loc1.driver2) {
                var driver2 = "";
              }
              if (loc1.alert) {
                alertList.push(loc1.alert);
              }
              if (loc1.shipmentNo) {
                var shipmentNo = loc1.shipmentNo;
              }
              if (!loc1.shipmentNo) {
                var shipmentNo = "Not Set";
              }
              if (loc1.timeQueue) {
                var timeQueue = loc1.timeQueue;
              }
              if (!loc1.shipmentNo) {
                var timeQueue = "N/A";
              }
              var timeExt = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("YYYY/MM/DD, HH:mm");
              var docID = moment(new Date().toISOString())
                .locale("en")
                .add(2, "hours")
                .format("DDMMYYYY-HH:mm:ss")
                .toString();
              var date = moment(new Date().toISOString())
                .locale("en")
                .format("YYYY-MM-DD");
              admin
                .firestore()
                .collection("trips")
                .doc(docID)
                .set({
                  key: docID,
                  origin: loc1.origin,
                  destination: loc1.destination,
                  code: loc1.code,
                  driver: loc1.driver,
                  date: date,
                  fleetNo: loc1.fleetNo,
                  timeStart: loc1.timeStart,
                  timeArrived: loc1.timeArrived,
                  timeExit: timeExt,
                  timeQueue: timeQueue,
                  alertList: alertList,
                  requiredETA: requiredETA,
                  driver2: driver2,
                  shipmentNo: shipmentNo,
                })
                .then(() => {
                  if (loc1.destination2) {
                    admin
                      .firestore()
                      .collection("trucks")
                      .doc(loc1.code)
                      .update({
                        timeStart: timeExt,
                        status: "en-route",
                        lat: loc2.lat,
                        lng: loc2.lon,
                        address: loc2.address,
                        origin: loc1.destination,
                        alertList: "",
                        alert: "",
                        destination: loc1.destination2,
                        destination2: "",
                        timeLoading: "",
                        timeStop: "",
                        timeArrived: "",
                        timeQueue: "",
                        requiredETA: "",
                        shipmentNo: "",
                        stopAlert: true,
                        estDist: 0,
                        estTime: 0,
                        eta: 0,
                      });
                    return resolve();
                  } else {
                    admin
                      .firestore()
                      .collection("trucks")
                      .doc(loc1.code)
                      .update({
                        timeStart: timeExt,
                        status: "en-route",
                        lat: loc2.lat,
                        lng: loc2.lon,
                        address: loc2.address,
                        origin: loc1.destination,
                        alertList: "",
                        alert: {
                          reason:
                            "This truck is on route and does not have an assigned destination",
                          action: "Assign Destination",
                          resolved: false,
                        },
                        destination: "",
                        timeLoading: "",
                        timeStop: "",
                        timeArrived: "",
                        timeQueue: "",
                        requiredETA: "",
                        shipmentNo: "",
                        stopAlert: true,
                        estDist: 0,
                        estTime: 0,
                        eta: 0,
                      });
                    return resolve();
                  }
                });
            }

            if (loc1.status === "en-route" && loc1.destination === "") {
              // en route and no location --> alert ctlr
              admin
                .firestore()
                .collection("trucks")
                .doc(loc1.code)
                .update({
                  lat: loc2.lat,
                  lng: loc2.lon,
                  address: loc2.address,
                  alert: {
                    reason:
                      "This truck is on route and does not have an assigned destination",
                    action: "Assign Destination",
                    resolved: false,
                  },
                });
              return resolve();
            }
            if (
              loc1.status === "en-route" &&
              loc1.destination != "" &&
              loc1.destination.name !== "None"
            ) {
              return graphETA(loc1, loc2).then((results) => {
                console.log("got ETA from Graph hopper", results);
                if (results.paths[0]) {
                  var dist = results.paths[0].distance / 1000;
                  let distance = Math.round(dist * 100) / 100;
                  let tim = results.paths[0].time / 60000;
                  let eta = Math.round(tim * 100) / 100;
                  var hrs = tim / 60;
                  var rhrs = Math.floor(hrs);
                  var minutes = (hrs - rhrs) * 60;
                  var rminutes = Math.round(minutes);
                  let duration = rhrs + " hour(s) " + rminutes + " mins";
                  admin.firestore().collection(`trucks`).doc(loc1.code).update({
                    estDist: distance,
                    estTime: duration,
                    eta: eta,
                    status: "en-route",
                    lat: loc2.lat,
                    lng: loc2.lon,
                    address: loc2.address,
                  });
                  return resolve();
                }
              });
              // return graphETA(loc1, loc2).then(results => {
              //     console.log("graph results: ", JSON.stringify(results));
              // })
              // en route and has a destination
              //calcETA(loc1, loc2)
              // return graphETA(loc1, loc2).then(results => {
              //     admin.firestore().collection(`trucks`).doc(loc1.code).update({
              //         estDist: results.paths[0].distance,
              //         eta: results.paths[0].time,
              //         status: "en-route",
              //         lat: loc2.lat,
              //         lng: loc2.lon,
              //     });
              //     console.log("graph results: ", JSON.stringify(results));
              // });
            }
          }
        });
      }
    }
    if (!loc1.lng || !loc1.lat) {
      console.log("triggered Else");
      var time = moment(new Date().toISOString())
        .locale("en")
        .add(2, "hours")
        .format("YYYY/MM/DD, HH:mm");
      admin
        .firestore()
        .collection("trucks")
        .doc(loc1.code)
        .update({
          lat: loc2.lat,
          lng: loc2.lon,
          address: loc2.address,
          status: "",
          destination: "",
          stopAlert: true,
          timeStart: time,
          origin: { name: loc2.address, lat: loc2.lat, lng: loc2.lon },
        });
      return resolve();
    }
  });
}

function checkDepo(loc2, list) {
  // checks if truck is at the depo/ within radius
  return new Promise(function (resolve, reject) {
    for (let i = 0; i <= list.length; i++) {
      // if (list[i].latUpper && list[i].latUpper !== undefined) {
      if (i < list.length) {
        if (
          loc2.lat <= list[i].latUpper &&
          loc2.lat >= list[i].latLower &&
          loc2.lon <= list[i].lngRight &&
          loc2.lon >= list[i].lngLeft
        ) {
          // is inside a geofence
          //console.log("we are inside a geofence")
          if (list[i].code) {
            var fence = {
              arrived: true,
              destination: {
                name: list[i].name,
                lat: list[i].lat,
                lng: list[i].lng,
                code: list[i].code,
              },
            };
            return resolve(fence);
          } else {
            var fence = {
              arrived: true,
              destination: {
                name: list[i].name,
                lat: list[i].lat,
                lng: list[i].lng,
              },
            };
            return resolve(fence);
          }
        }
      }
      // console.log(i);
      else if (i === list.length) {
        //console.log("we are outside a geofence")
        // not at a known destination
        var fen = { arrived: false };
        return resolve(fen);
      }
    }
  });
}

function graphETA(loc1, loc2) {
  return new Promise(function (resolve, reject) {
    var axios = require("axios");
    let lat1 = loc2.lat;
    let lng1 = loc2.lon;

    let lat2 = loc1.destination.lat;
    let lng2 = loc1.destination.lng;
    const APIkey = "1470a6eb-c72f-47d0-9fc7-7fe29d840d84";

    var config = {
      method: "get",
      url: `https://graphhopper.com/api/1/route?point=${lat1},${lng1}&point=${lat2},${lng2}&vehicle=car&locale=en&calc_points=false&key=${APIkey}`,
      headers: {},
    };

    axios(config)
      .then(function (response) {
        var results = response.data;
        return resolve(results);
        //console.log(JSON.stringify(response.data));
      })
      .catch(function (error) {
        functions.logger.info(error);
        console.log("Error with graphhopper", loc1, loc2);
        return reject(error);
      });
  });
}

exports.checkTrackable = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("00 05 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return trackable().then((res) => {
      console.log(res);
    });
  });

function trackable() {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("trucks")
      .get()
      .then((trucks) => {
        const len = trucks.docs.length;
        //console.log(len)
        let i = 0;
        trucks.docs.forEach((truck) => {
          i = ++i;
          if (truck.data().code && truck.data().fleetNo) {
            getLocation(truck.data()).then((results) => {
              if (results.length !== 0) {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(truck.data().code)
                  .update({
                    tracking: true,
                  });
              } else if (results.length === 0) {
                admin
                  .firestore()
                  .collection("trucks")
                  .doc(truck.data().code)
                  .update({
                    tracking: false,
                  });
              }
            });
          }
        });
        if (i == len) {
          let done = "complete";
          return resolve(done);
        }
      });
  });
}

exports.testingSAB = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 2 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    getDestinationList().then(function (destinationList) {
      getTrucksArray().then(function (truckList) {
        return functions.logger.info(
          "truck and dest list",
          truckList.length,
          destinationList.length
        );
      });
    });
  });

function getTrucksArray() {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("trucks")
      .where("tracking", "==", true)
      .where("fleet", "==", "SAB")
      .get()
      .then((trucks) => {
        let truckList = [];
        let i = 0;
        const len = trucks.docs.length;
        trucks.docs.forEach((truck) => {
          truckList.push(truck.data());
          i = ++i;
        });
        if (i == len) {
          let list = truckList;
          return resolve(list);
        }
      });
  });
}

function getDestinationList() {
  return new Promise((resolve, reject) => {
    admin
      .firestore()
      .collection("destinations")
      .orderBy("latUpper")
      .get()
      .then((destinations) => {
        var destList = [];
        const len = destinations.docs.length;
        let i = 0;
        destinations.docs.forEach((dest) => {
          destList.push(dest.data());
          i = ++i;
        });
        if (i == len) {
          let list = destList;
          return resolve(list);
        }
      });
  });
}
// Check if trucks have been idle in yard for too long
exports.getIdleTrucks = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 30 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var idleTrucks = [];
    admin
      .firestore()
      .collection("trucks")
      .get()
      .then((trucks) => {
        trucks.forEach((truck) => {
          if (
            truck.data().timeStamp !== "" &&
            truck.data().timeStamp !== undefined
          ) {
            var now = moment(new Date()).format("YYYY/MM/DD HH:mm");
            var timeStamp = truck.data().timeStamp;
            var duration = moment(now, "YYYY/MM/DD, HH:mm").diff(
              moment(timeStamp, "YYYY/MM/DD, HH:mm"),
              "minutes",
              true
            );
            if (duration > 120) {
              idleTrucks.push(truck.data());
            }
          }
        });
        setOperatorEmails(idleTrucks);
      });
  });

function setOperatorEmails(trucks) {
  var count = 0;
  var length = trucks.length;
  setInterval(() => {
    if (count !== length) {
      sendEmails(trucks, count).then(() => {
        count = count + 1;
      });
    } else {
      clearInterval();
    }
  }, 2000);
}

function sendEmails(trucks, index) {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: '"PLS APP TEAM" <dashalert@plsolutions.co.za>',
      to: "",
      subject: "PLS: Idle Truck!",
      text: `Good Day,\n\nTruck ${trucks[index].fleetNo} has been idle in the yard for more than 2 hours\n\nKindly,\nApp Team`,
    };
    var type = "Operator" + ": " + trucks[index].fleet;

    admin
      .firestore()
      .collection("users")
      .where("type", "==", type)
      .get()
      .then((users) => {
        users.forEach((user) => {
          mailOptions.to = user.data().email;
          mailTransport
            .sendMail(mailOptions)
            .then(() => {
              console.log("Email Sent");
            })
            .catch(function (error) {
              return console.error(
                "There was an error while sending the email:",
                error
              );
            });
        });
        resolve();
      });
  });
}

exports.checkAuths = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 3 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var now = moment(new Date().toISOString())
      .locale("en")
      .add(2, "hours")
      .format("YYYY/MM/DD, HH:mm");
    return admin
      .firestore()
      .collection("trucks")
      .where("authenticated", "==", "Awaiting")
      .get()
      .then((trucks) => {
        return trucks.forEach((truck) => {
          if (truck.data().authTime && truck.data().authTime !== "") {
            var diff = moment(now, "YYYY/MM/DD, HH:mm").diff(
              moment(truck.data().authTime, "YYYY/MM/DD, HH:mm"),
              "minutes",
              true
            );
            if (diff > 6) {
              console.log("Time up");
              var doc = {
                key: v4(),
                time: moment(new Date().toISOString())
                  .locale("en")
                  .format("HH:mm"),
                date: moment(new Date().toISOString())
                  .locale("en")
                  .format("DD/MM/YYYY"),
                code: truck.data().code,
                registration: truck.data().registration,
                fleetNo: truck.data().fleetNo,
                fleet: truck.data().fleet,
                operator: "",
                operatorKey: "",
                operatorSig: "",
                deviations: "",
                override: false,
                jobNo: truck.data().jobNo,
                status: "Timed Out",
                actioned: false,
                timeStamp: now,
              };
              admin
                .firestore()
                .collection("authentications")
                .doc(doc.key)
                .set(doc)
                .then(() => {
                  admin
                    .firestore()
                    .collection("trucks")
                    .doc(truck.data().code)
                    .update({
                      authenticated: "Authorised",
                      authUser: "Automatic Auth",
                      authTime: "",
                      override: true,
                      deviations: false,
                    })
                    .then(() => {
                      console.log("Done");
                    });
                });
            } else {
              console.log("In time");
            }
          }
        });
      });
  });

exports.checkoutStarted = functions.firestore
  .document("inspections/{uid}")
  .onCreate((snap) => {
    const inspection = snap.data();
    if (inspection.type === "checkout") {
      console.log(inspection.code);
      admin
        .firestore()
        .collection("authentications")
        .where("code", "==", inspection.code)
        .orderBy("timeStamp", "desc")
        .limit(1)
        .get()
        .then((auths) => {
          auths.forEach((auth) => {
            var lastAuth = auth.data();
            console.log(lastAuth.key);
            admin
              .firestore()
              .collection("authentications")
              .doc(lastAuth.key)
              .update({ actioned: true });
          });
        });
    } else {
      // Not a checkout
    }
  });

exports.checkCheckOuts = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("every 3 minutes")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var now = moment(new Date().toISOString())
      .locale("en")
      .add(2, "hours")
      .format("YYYY/MM/DD, HH:mm");
    return admin
      .firestore()
      .collection("authentications")
      .where("actioned", "==", false)
      .get()
      .then((auths) => {
        auths.forEach((auth) => {
          if (auth.data().timeStamp && auth.data().timeStamp !== "") {
            console.log("Time: ", auth.data().timeStamp, "Now: ", now);
            var diff = moment(now, "YYYY/MM/DD, HH:mm").diff(
              moment(auth.data().timeStamp, "YYYY/MM/DD, HH:mm"),
              "minutes",
              true
            );
            console.log(diff);
            if (diff > 6) {
              console.log("Time up");
              var checkout = {
                key: v4(),
                code: auth.data().code,
                truckReg: auth.data().registration,
                truckFleet: auth.data().fleet,
                truckFleetNo: auth.data().fleetNo,
                jobNo: auth.data().jobNo,
                status: "Timed Out",
                type: "checkout",
                report: "Check Out",
                timeStamp: now,
                date: moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("YYYY/MM/DD"),
                timeOut: moment(new Date().toISOString())
                  .locale("en")
                  .add(2, "hours")
                  .format("HH:mm"),
              };
              admin
                .firestore()
                .collection("inspections")
                .doc(checkout.key)
                .set(checkout)
                .then(() => {
                  admin
                    .firestore()
                    .collection("trucks")
                    .doc(auth.data().code)
                    .update({ jobNo: "", timeStamp: "" })
                    .then(() => {
                      admin
                        .firestore()
                        .collection("authentications")
                        .doc(auth.data().key)
                        .update({ actioned: true });
                      console.log("Done");
                    });
                });
            } else {
              console.log("In time");
            }
          }
        });
      });
  });

exports.overviewCalcs = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("40 17 * * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    return admin
      .firestore()
      .collection("overviews")
      .orderBy("name", "asc")
      .get()
      .then((fleets) => {
        var allFleets = [];
        if (fleets) {
          fleets.forEach((fleet) => {
            allFleets.push(fleet.data().name);
          });
          return loopFleet(allFleets);
        }
      })
      .catch((err) => functions.logger.error("Error ", err));
  });

function loopFleet(allFleets) {
  return new Promise((resolve, reject) => {
    for (var i = 0; i < allFleets.length; ) {
      setValuesToUpdate(allFleets[i]).then((res) => {
        functions.logger.info("RESULT", res);
        var date = moment(new Date()).format("YYYY-MM");
        return admin
          .firestore()
          .collection(`overviews/${res.fleet}/reports`)
          .doc(date)
          .set(res.inspections, { merge: true })
          .then(() => {
            return console.log("update", res.fleet);
          })
          .catch((err) => {
            functions.logger.error(`Save Error ${res.fleet}`, err);
          });
      });
      i++;
    }
    return resolve();
  });
}

function setValuesToUpdate(fleetInput) {
  return new Promise((resolve, reject) => {
    let fleet;
    let inspections = {
      workshop: 0,
      washbay: 0,
      tyrebay: 0,
      checkout: 0,
      checkin: 0,
      dieselbay: 0,
      allCount: 0,
      inCount: 0,
      outCount: 0,
      totalDeviations: 0,
      totalEquipmentDeviations: 0,
      totalInspectionsDeviations: 0,
    };
    let deviations = {
      workshop: 0,
      washbay: 0,
      tyrebay: 0,
      checkout: 0,
      checkin: 0,
      dieselbay: 0,
    };
    getFleetInfo(fleetInput).then((data) => {
      inspections.allCount = data.counts[0];
      inspections.inCount = data.counts[1];
      inspections.outCount = data.counts[2];
      fleet = data.fleet;
      getInspectioInfo(fleetInput).then((data) => {
        if (data.divisions.length > 0) {
          data.divisions.forEach((division) => {
            inspections[`${division.type}`] = division.count;
            deviations[`${division.type}`] = division.deviations;
          });
          inspections.deviations = deviations;
          inspections.totalInspections = data.totalCheckins;
          inspections.totalDeviations = data.totalDeviations;
          inspections.totalEquipmentDeviations = data.totalEquipmentDeviations;
          inspections.totalInspectionsDeviations =
            data.totalInspectionsDeviations;
        } else inspections.totalInspections = data.totalCheckins;
        if (fleet !== data.fleet) {
          functions.logger.error("fleet miss match", fleet, data.fleet);
        }
        return resolve({ fleet, inspections });
      });
    });
  });
}

function getFleetInfo(fleet) {
  return new Promise((resolve, reject) => {
    let allCount = 0;
    let inCount = 0;
    admin
      .firestore()
      .collection("trucks")
      .where("fleet", "==", fleet)
      .get()
      .then((trucks) => {
        trucks.forEach((truck) => {
          var truck = truck.data();
          allCount++;
          if (
            (truck.timeStamp && truck.timeStamp !== "") ||
            (truck.timeStamp && truck.timeStamp !== undefined)
          ) {
            inCount++;
          }
        });
        var outCount = allCount - inCount;
        return resolve({ fleet, counts: [allCount, inCount, outCount] });
      });
  });
}

function getInspectioInfo(fleet) {
  return new Promise((resolve, reject) => {
    const date = moment(new Date()).format("YYYY-MM");
    let start = moment(date).startOf("month").format("YYYY/MM/DD");
    let end = moment(date).endOf("month").format("YYYY/MM/DD");
    let totalCheckins = 0;
    let totalDeviations = 0;
    let deviations = 0;
    let totalEquipmentDeviations = 0;
    let totalInspectionsDeviations = 0;

    return admin
      .firestore()
      .collection("inspections")
      .where("truckFleet", "==", fleet)
      .orderBy("date", "desc")
      .startAt(end)
      .endAt(start)
      .get()
      .then((inspections) => {
        totalCheckins = inspections.size;
        let divisions = [];
        if (totalCheckins > 0) {
          inspections.forEach((inspection) => {
            let deviations = 0;
            if (
              inspection.data().deviations &&
              inspection.data().deviations.length > 0
            ) {
              totalDeviations =
                totalDeviations + inspection.data().deviations.length;
              deviations = deviations + inspection.data().deviations.length;

              inspection.data().deviations.forEach((dev) => {
                if (dev.equipment) {
                  totalEquipmentDeviations++;
                }
                if (dev.item) {
                  totalInspectionsDeviations++;
                }
              });
            }

            let i;
            if (!divisions.some((div) => div.type === inspection.data().type)) {
              divisions.push({
                type: inspection.data().type,
                count: 1,
                deviations: deviations,
              });
            } else if (
              divisions.some((div) => div.type === inspection.data().type)
            ) {
              divisions.some((field, index) => {
                field.type === inspection.data().type;
                i = index;
              });
              divisions[i].count++;
              divisions[i].deviations = divisions[i].deviations + deviations;
            }
          });
        }
        console.log("Number of deviations:", deviations);
        return resolve({
          divisions,
          totalCheckins,
          fleet,
          totalDeviations,
          totalEquipmentDeviations,
          totalInspectionsDeviations,
        });
      });
  });
}

exports.setReports = functions
  .runWith(runtimeOpts)
  .pubsub.schedule("00 04 1 * *")
  .timeZone("Africa/Johannesburg")
  .onRun(() => {
    var today = moment(new Date()).format("YYYY-MM");
    return admin
      .firestore()
      .collection("fleets")
      .get()
      .then((fleets) => {
        fleets.forEach((fleet) => {
          var doc = {
            date: today,
          };
          admin
            .firestore()
            .collection(`overviews/${fleet.data().name}/reports`)
            .doc(today)
            .set(doc)
            .then(() => {
              console.log("Set");
            });
        });
        return console.log("Done");
      });
  });

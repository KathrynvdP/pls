import { Injectable, EventEmitter } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Platform } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfServiceService {
  linkAdded: EventEmitter<string>;
  pdfObj = null;

  logo = "../../assets/imgs/main.png";
  logoPremier = '../../assets/imgs/logo.jpg';
  logoMichelin = '../../assets/imgs/MichelinLogo.jpg';
  downloadURL: Observable<string | null>;

  constructor(private angularFireStorage: AngularFireStorage, public platform: Platform, //public file: File, public fileopener: FileOpener
    ) {
    this.linkAdded = new EventEmitter();
  }

  toDataUrl(url) {
    return new Promise<any>((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          return resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    })
  }

  async petProfile(note, download, cutomerSigniture: string, driverSigniture: string, storemenSigniture: string, customNotes: string) {
    const promise = new Promise(async (resolve, reject) => {
      let pet = note.stock;
      var str = 'thisIsAString';
      var matches = str.match(/[A-Z]/g);
      console.log(matches);
      console.log('this is the note');
      console.log(note);


      var docDefinition = await {
        pageOrientation: 'landscape',

        content: [
          // {
          //   image: headerImage,
          //   width: 100,
          //   alignment: 'center'
          // },
          // { text: 'Delivery Note', style: 'header' },
          {
            style: 'table2',
            layout: 'lightHorizontalLines',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    stack: [
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'Transaction No', style: 'field2' },
                      { text: 'Transaction Date', style: 'field2' },
                      { text: 'Transaction Status', style: 'field2' },
                      { text: 'Ref No', style: 'field2' },
                      { text: 'Cust. Ref No', style: 'field2' },
                      { text: ' ', style: 'field2' }
                    ]
                  },
                  {
                    stack: [
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'Order No.', style: 'field2' },
                      { text: 'Order Date', style: 'field2' }


                    ]
                  },
                  {
                    stack: [
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: note.startPos.address.split(',')[0], style: 'field2' },
                      { text: note.startPos.address.split(',')[1], style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'Tel.', style: 'field2'},
                      { text: 'Fax', style: 'field2' }
                    ]
                  },
                  {
                    // stack: [
                    //   { image: await this.toDataUrl(this.logoPremier), width: 100, height: 40 },
                    //   { image: await this.toDataUrl(this.logoMichelin), width: 100, height: 30 },
                    // ]
                    style: 'table',
                    layout: 'noBorders',
                    table: {
                      widths: ['45%','10%', '45%'],
                      body: [
                        [
                          { image: await this.toDataUrl(this.logoPremier), width: 100, height: 40 },
                          { text: ' ', style: 'field2' },
                          { image: await this.toDataUrl(this.logoMichelin), width: 100, height: 30 }
                        ]
                      ]
                    }
 

                  }
                ]

              ]
            }
          },
          {
            canvas: [
                { type: 'line', x1: 0, y1: 0, x2: 750, y2: 0, lineWidth: 1 }, //Bottom line
            ]
        },
          {
            style: 'table2',
            layout: 'noBorders',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'Customer', style: 'fieldBold' },
                      { text: note.customer.name, style: 'field2' },
                      { text: note.customer.address.split(',')[0] , style: 'field2' },
                      { text: note.customer.address.split(',')[1] , style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'TEL:  ' + note.customer.contact , style: 'field2' },
                      { text: 'Fax', style: 'field2' }

                    ]
                  },
                  {
                    stack: [
                      { text: 'Transporter', style: 'fieldBold' },
                      { text: 'PREMIER LOGISTICS SOLUTIONS', style: 'field2' },
                      { text: '48 MORRIS STREET', style: 'field2' },
                      { text: 'MEYERTON FARMS', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'TEL', style: 'field2' },
                      { text: 'Fax', style: 'field2' }

                    ]
                  },
                  {
                    stack: [
                      { text: 'Warehouse', style: 'fieldBold' },
                      { text: note.startPos.name , style: 'field2' },
                      { text: note.startPos.address.split(',')[0], style: 'field2' },
                      { text: note.startPos.address.split(',')[1], style: 'field2' },
                      { text: note.startPos.address.split(',')[2], style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'Tel.', style: 'field2' },
                      { text: 'Fax', style: 'field2' }
                    ]
                  },
                  {
                    stack: [
                      { text: 'Consignee', style: 'fieldBold' },
                      { text: note.endPos.name, style: 'field2' },
                      { text: 'Delivery Address', style: 'field2' },
                      { text: note.endPos.address, style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: ' ', style: 'field2' },
                      { text: 'Tel.', style: 'field2' },
                      { text: 'Fax', style: 'field2' }
                    ]

                  }
                ]

              ]
            }
          },

          {
            style: 'table2',
            layout: 'noBorders',
            table: {
              widths: ['10%', '10%', '20%', '10%', '10%', '40%'],
              body: [
                [
                  { text: 'ORDER DATE ', style: 'field' },
                  { text: 'DISPATCH DATE', style: 'field' },

                  { text: 'Customer PO', style: 'field' },
                  { text: 'TSR', style: 'field' },
                  { text: 'CSR', style: 'field' },
                  { text: '', style: 'field' },

                ],
                [
                  { text: note.orderDate, style: 'field' },
                  { text: note.dispatchDate, style: 'field' },

                  { text: note.customer.code, style: 'field' },
                  { text: 'TSR', style: 'field' },
                  { text: 'CSR', style: 'field' },
                  { text: '', style: 'field' },

                ]

              ]
            },
          },
          {
            canvas: [
              { type: 'line', x1: 0, y1: -20, x2: 762, y2: -20, lineWidth: 1 }, //Bottom line
              { type: 'line', x1: 1, y1: 0, x2: 1, y2: -20, lineWidth: 1 },
              { type: 'line', x1: 761, y1: 0, x2: 761, y2: -20, lineWidth: 1 }
              ] 
            },
          {
            style: 'table2',
            layout: 'Borders',
            table: {
              widths: ['10%', '20%', '10%', '10%', '10%', '10%', '10%', '10%', '10%'],
              body: [
                [
                  { text: 'ITEM NUMBER', style: 'field' },
                  { text: 'DESCRIPTION', style: 'field' },
                  { text: 'SERIAL NO', style: 'field' },
                  { text: 'U/M', style: 'field' },
                  { text: 'KG', style: 'field' },
                  { text: 'QTY ORDERED', style: 'field' },
                  { text: 'BACK ORDERED', style: 'field' },
                  { text: 'QTY SUPPLIED', style: 'field' },
                  { text: 'QTY RECEIVED', style: 'field' }
                ]

              ]
            },
          },

          {
            style: 'table3',
            layout: 'Borders',
            table: {
              widths: ['20%', '40%', '20%', '20%'],
              body: [
                [
                  {
                    stack: [
                      { text: 'TOTAL WEIGHT', style: 'field' },
                      { text: note.weight, style: 'field' },

                    ]
                  },
                  { text: ' ', style: 'field' },

                  {
                    stack: [
                      { text: 'TOTAL VOLUME ', style: 'field' },
                      { text: this.calculateAmout(pet), style: 'field' },

                    ]
                  },
                  {
                    stack: [
                      { text: 'TOTAL QTY SUPPLIED', style: 'field' },
                      { text: '1', style: 'field' }
                    ]
                  },
                ]

              ]
            },
          },

          {
            margin: [0, -180],
            layout: 'Borders',
            table: {
              widths: ['20%', '20%', '20%', '20%', '20%'],
              body: [
                [
                  { text: 'DRIVERS SIGNATURE', style: 'field' },
                  { text: 'STOREMEN SIGNATURE', style: 'field' },
                  { text: 'RECEIVER SIGNATURE', style: 'field' },

                  { text: 'TIME OF DAY', style: 'field' },
                  { text: 'DATE RECEIVED', style: 'field' },
                ],
                [
                  {
                    image: driverSigniture,
                    width: 50,
                    alignment: 'center'
                  },
                  {
                    image: storemenSigniture,
                    width: 50,
                    alignment: 'center'
                  },
                  {
                    image: cutomerSigniture,
                    width: 50,
                    alignment: 'center'
                  },
                  { text: new Date().toLocaleTimeString(), style: 'field' },
                  { text: new Date().toLocaleDateString(), style: 'field' },
                ]

              ]
            },
          },
          
          {
            margin: [0, 180],
            layout: 'Borders',
            table: {
              widths: ['100%'],
              body: [
                [
                  { text: 'For any queries on this delivery please contact customer services on 0860100480', style: 'field' },

                ],
                [
                  {
                    stack: [
                      { text: 'Notes:', style: 'field' },
                      { text: ' ', style: 'field' },
                      { text: this.ocupySpace(customNotes), style: 'field' }

                  ]
                }

                ]

              ]
            },
          }
        ],
        styles: {
          info: {
            margin: [0, 10, 0, 20],
            fontSize: 18,
            color: '#D7CAC3',
            alignment: 'center'
          },
          headLabel: {
            fontSize: 18,
            color: '#ffffff',
            alignment: 'center',
            bold: true,
            fillColor: '#C3D7D6',
          },
          field: {
            fontSize: 5,
            alignment: 'center',
            color: 'black',
          },
          field2: {
            fontSize: 5,
            color: 'black',
          },
          fieldBold: {
            fontSize: 5,
            color: 'black',
            bold: true

          },
          header: {
            margin: [0, 10, 0, 10],
            fontSize: 22,
            bold: true,
            color: '#C3D7D6',
            alignment: 'center',
          },
          table: {
            margin: [0, 5, 0, 15]
          },
          table2: {
            margin: [0, 0, 0, 0]
          },
          table3: {
            margin: [0, 180]
          },
          signiture: {
            width: 50,
            alignment: 'center'
          },

        },
        defaultStyle: {
          // alignment: 'justiSfy'
        }
      }

      pet.forEach(item => {
        item.serials.forEach(serial => {
          let x: any = [
            { text: item.cad, style: 'field' },
            { text: item.cai, style: 'field' },
            { text: serial.serial, style: 'field' },
            { text: 'U/M', style: 'field' },
            { text: item.weight, style: 'field' },
            { text: item.amount, style: 'field' },
            { text: '0', style: 'field' },
            { text: '1', style: 'field' },
            { text: '1', style: 'field' }
          ]
          docDefinition.content[5].table.body.push(x);
        });

      });
      console.log(docDefinition);
      this.generatePDF(docDefinition, download, note).then((res) => {
        resolve(res)
      })
    })
    return promise;

  }

  generatePDF(docDefinition, download, note) {
    const promise = new Promise((resolve, reject) => {
      this.pdfObj = pdfMake.createPdf(docDefinition);
      console.log('pdf generated');
      
      if (this.platform.is('cordova')) {
        // this.pdfObj.getBuffer((buffer) => {
        //   var blob = new Blob([buffer], { type: 'application/pdf' });
        //   console.log('this is the blobbbbbbb');
        //   console.log(blob);
        //   console.log(this.file.dataDirectory);


        //   this.file.writeFile(this.file.dataDirectory, 'notes.pdf', blob, { replace: true }).then(fileEntry => {
        //     if (download === true) {
        //       console.log("downloading")
        //       this.fileopener.open(this.file.dataDirectory + 'notes.pdf', 'application/pdf');
        //       resolve('###############3')
        //     } else {
        //       console.log("saving")
        //       console.log(fileEntry)
        //       this.saveFile(blob, note).then((url) => {
        //         resolve(url)
        //       })
        //     }

        //   }).catch(err => {
        //     alert("Error: " + err);
        //   })
        // });
      } else {
        console.log(download)
        if (download) {
          this.pdfObj.download('notes.pdf');
        }
      }
    })
    return promise;

  }

  saveFile(file, note) {
    const promise = new Promise((resolve, reject) => {
      const imageID = new Date().getTime();

      let photo = this.angularFireStorage.ref(`/orders/${note.delNote}.pdf`);

      var metadata = {
        contentType: 'application/pdf',
      }

      photo.put(file, metadata).then(snapshot => {
        const ref = this.angularFireStorage.ref(`/orders/${note.delNote}.pdf`);
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url => {
          if (url) {
            console.log("this si the url")
            console.log(url)
            resolve(url);
          }
        })
      })
    })
    return promise;
  }
  calculateTotalWeight(orders) {
    let i = 0;
    orders.forEach(order => {
      i += order.weight;
    });
    return i;
  }
  calculateAmout(orders) {
    let i = 0;
    orders.forEach(order => {
      i += order.amount;
    });

    return i;
  }
  ocupySpace(val)  {
    if(val) {
      return val;
    }
    else  {
      const x =
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n' +
      '                                                                  \n';


      console.log('spacesssssssssssssssssssssssssssssssss');
      return x;
    }
  }
}


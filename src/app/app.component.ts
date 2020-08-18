import { Component, OnInit } from '@angular/core';
import { GlobalService } from "./services/global.service";

export interface item {
  ITEM_NO: string;
  LPP_DATE: string;
  LPP_DOCUMENT: string;
  LPP_IN_INR: string;
  LPP_VENDOR: string;
  PR_QTY: string;
  PR_RATE: string;
  SERV_LINE_NO: string;
  UNIT_OF_MEASUREMENT: string;
  VENDOR_QUOTE: string;
  COLOR: string;
}

export interface Vendor {
  items: item[];
  name: String;
}

export interface Round {
  vendors: Vendor[];
}

export interface Data {
  rounds: Round[];
  rfxNumber: String;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tisco-web';
  maxNoOfRound: number = 5;
  data1: Data;
  data2: Data;
  gotdata1: boolean = false;
  gotdata2: boolean = false;
  items1: item[] = [];
  items2: item[] = [];

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    let d1 = "2008160001";
    // this.getErfxRoundData1(d1);
    let d2 = "2008170001";
    this.getErfxRoundData(d2);
  }



  getErfxRoundData(d2) {
    this.globalService.getErfxRoundData(d2).subscribe((res: any) => {
      let rounds: Round[] = [];
      this.maxNoOfRound = this.getMaxRound(res);
      let temp = 0;
      for (var t = 0; t <= this.maxNoOfRound; t++) {
        let tempround = this.getRoundIdex(res, t);
        let vendors: Vendor[] = [];
        for (var e = 0; e < tempround.length; e++) {
          let d: Vendor;
          if (tempround[e].ITEMS != "") {
            if (temp == 0) {
              temp = this.checkServiceOrNot(tempround[e].ITEMS.item);
            }
            if (temp == 1) {
              this.setItems2(tempround[e].ITEMS.item)
            } else if (temp == 2) {
              this.setItems1(tempround[e].ITEMS.item)
            }

            d = { name: tempround[e].SUPPLIER, items: tempround[e].ITEMS.item };
          } else {
            let Items: item[] = [];
            d = { name: tempround[e].SUPPLIER, items: Items };
          }
          vendors.push(d);

        }
        for (let index = 0; index < vendors.length; index++) {
          for (let index1 = 1; index1 < vendors.length; index1++) {
            let v1 = vendors[index];
            let v2 = vendors[index1];
            let maxItemCount = v1.items.length < v2.items.length ? v2.items.length : v1.items.length;
            for (let index3 = 0; index3 < maxItemCount; index3++) {
              if (v1.items[index3].VENDOR_QUOTE > v2.items[index3].VENDOR_QUOTE) {
                v2.items[index3].COLOR = "#47ec6b";
                v1.items[index3].COLOR = "#efefef";
              } else if (v1.items[index3].VENDOR_QUOTE < v2.items[index3].VENDOR_QUOTE) {
                v2.items[index3].COLOR = "#efefef";
                v1.items[index3].COLOR = "#47ec6b";
              }
            }
          }
        }
        let round: Round = { vendors: vendors };
        rounds.push(round);
      }
      if (temp == 2) {
        this.gotdata1 = true;
        this.data1 = { rfxNumber: d2, rounds: rounds };
        console.log(this.data1);
        console.log(this.items1);
      } else if (temp == 1) {
        this.gotdata2 = true;
        this.data2 = { rfxNumber: d2, rounds: rounds };
        console.log(this.data2);
        console.log(this.items2);
      }

    })
  }

  getMaxRound(res) {
    let max = 0;
    for (let index = 0; index < res.length; index++) {
      if (max < res[index].ROUND) {
        max = res[index].ROUND
      }
    }
    return max;
  }

  setItems1(tempround) {
    for (var i = 0; i < tempround.length; i++) {
      if (this.isItemNotPresent(tempround[i].ITEM_NO)) {
        this.items1.push(tempround[i]);
      }
    }
  }

  setItems2(tempround) {
    for (var i = 0; i < tempround.length; i++) {
      if (this.isItemNotPresent2(tempround[i].ITEM_NO, tempround[i].SERV_LINE_NO)) {
        this.items2.push(tempround[i]);
      }
    }
  }

  isItemNotPresent(ITEM_NO) {
    let res: boolean = true;
    if (this.items1.length == 0) {
      return true
    }
    for (var i = 0; i < this.items1.length; i++) {
      if (this.items1[i].ITEM_NO == ITEM_NO) {
        return false;
      } else {
        continue;
      }
    }
    return res;
  }

  isItemNotPresent2(ITEM_NO, SERV_LINE_NO) {
    let res: boolean = true;
    if (this.items2.length == 0) {
      return true
    }
    for (var i = 0; i < this.items2.length; i++) {
      if (this.items2[i].ITEM_NO == ITEM_NO && this.items2[i].SERV_LINE_NO == SERV_LINE_NO) {
        return false;
      } else {
        continue;
      }
    }
    return res;
  }

  checkServiceOrNot(item) {
    let itemno1, itemno2;
    for (var i = 0; i < item.length; i++) {
      if (i == 0) {
        itemno1 = item[i].ITEM_NO;
      } else if (i == 1) {
        itemno2 = item[i].ITEM_NO;
      }
    }
    if (itemno1 == itemno2) {
      return 1;
    } else if (itemno1 != itemno2) {
      return 2;
    }
  }

  getRoundIdex(d1, index) {
    let data = [];
    for (var i = 0; i < d1.length; i++) {
      if (d1[i].ROUND == index) {
        data.push(d1[i]);
      }
    }
    return data;
  }

  // getErfxRoundData1(d1) {
  //   this.globalService.getErfxRoundData(d1).subscribe((res: any) => {
  //     this.gotdata1 = true;
  //     let rounds: Round[] = [];
  //     this.maxNoOfRound = this.getMaxRound(res);
  //     for (var t = 0; t <= this.maxNoOfRound; t++) {
  //       let tempround = this.getRoundIdex(res, t);
  //       let vendors: Vendor[] = [];
  //       for (var e = 0; e < tempround.length; e++) {
  //         let d: Vendor;
  //         if (tempround[e].ITEMS != "") {
  //           // if (this.items.length == 0) {
  //           //   this.items = tempround[e].ITEMS.item
  //           // }
  //           this.setItems1(tempround[e].ITEMS.item)
  //           d = { name: tempround[e].SUPPLIER, items: tempround[e].ITEMS.item };
  //         } else {
  //           let Items: item[] = [];
  //           d = { name: tempround[e].SUPPLIER, items: Items };
  //         }
  //         vendors.push(d);

  //       }
  //       for (let index = 0; index < vendors.length; index++) {
  //         for (let index1 = 1; index1 < vendors.length; index1++) {
  //           let v1 = vendors[index];
  //           let v2 = vendors[index1];
  //           let maxItemCount = v1.items.length < v2.items.length ? v2.items.length : v1.items.length;
  //           for (let index3 = 0; index3 < maxItemCount; index3++) {
  //             if (v1.items[index3].VENDOR_QUOTE > v2.items[index3].VENDOR_QUOTE) {
  //               v2.items[index3].COLOR = "#47ec6b";
  //               v1.items[index3].COLOR = "#efefef";
  //             } else if (v1.items[index3].VENDOR_QUOTE < v2.items[index3].VENDOR_QUOTE) {
  //               v2.items[index3].COLOR = "#efefef";
  //               v1.items[index3].COLOR = "#47ec6b";
  //             }
  //           }
  //         }
  //       }
  //       let round: Round = { vendors: vendors };
  //       rounds.push(round);
  //     }
  //     this.data1 = { rfxNumber: d1, rounds: rounds };
  //     console.log(this.data1);
  //     console.log(this.items1);
  //   })
  // }

}

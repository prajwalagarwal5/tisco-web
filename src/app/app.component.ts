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
  data: Data;
  gotdata: boolean = false;
  items: item[] = [];

  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    let d1 = "2008160001";
    this.globalService.getErfxRoundData(d1).subscribe((res: any) => {
      this.gotdata = true;
      let rounds: Round[] = [];
      this.maxNoOfRound = this.getMaxRound(res);
      for (var t = 0; t <= this.maxNoOfRound; t++) {
        let tempround = this.getRoundIdex(res, t);
        let vendors: Vendor[] = [];
        for (var e = 0; e < tempround.length; e++) {
          let d: Vendor;
          if (tempround[e].ITEMS != "") {
            // if (this.items.length == 0) {
            //   this.items = tempround[e].ITEMS.item
            // }
            this.setItems(tempround[e].ITEMS.item)
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
                v2.items[index3].COLOR = "#47ec6b"
                v1.items[index3].COLOR = "#efefef"
              } else if (v1.items[index3].VENDOR_QUOTE < v2.items[index3].VENDOR_QUOTE) {
                v2.items[index3].COLOR = "#efefef"
                v1.items[index3].COLOR = "#47ec6b"
              }

            }

          }

        }
        let round: Round = { vendors: vendors };
        rounds.push(round);
      }
      this.data = { rfxNumber: d1, rounds: rounds };
      console.log(this.data);
      console.log(this.items);
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

  setItems(tempround) {
    for (var i = 0; i < tempround.length; i++) {
      if ((tempround[i].ITEMS != [] || tempround[i].ITEMS != "") && this.isItemNotPresent(tempround[i].ITEM_NO)) {
        this.items.push(tempround[i]);
      }
    }
  }

  isItemNotPresent(ITEM_NO) {
    let res: boolean = true;
    if (this.items.length == 0) {
      return true
    }
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].ITEM_NO == ITEM_NO) {
        return false;
      } else {
        continue;
      }
    }
    return res;
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

}

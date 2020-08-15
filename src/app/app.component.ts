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
    let d1 = "20200731104454.0269040";
    this.globalService.getErfxRoundData(d1).subscribe((res: any) => {
      this.gotdata = true;
      let rounds: Round[] = [];
      for (var t = 0; t <= this.maxNoOfRound; t++) {
        let tempround = this.getRoundIdex(res, t);
        let vendors: Vendor[] = [];
        for (var e = 0; e < tempround.length; e++) {
          let d: Vendor;
          if (tempround[e].ITEMS != "") {
            if (this.items.length == 0) {
              this.items = tempround[e].ITEMS.item
            }
            d = { name: tempround[e].SUPPLIER, items: tempround[e].ITEMS };
          } else {
            let Items: item[] = [];
            d = { name: tempround[e].SUPPLIER, items: Items };
          }
          vendors.push(d);
        }
        let round: Round = { vendors: vendors };
        rounds.push(round);
      }
      this.data = { rfxNumber: d1, rounds: rounds };
      console.log(this.data);
      console.log(this.items);
    })
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

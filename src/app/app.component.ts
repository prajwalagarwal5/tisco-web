import { Component, OnInit } from '@angular/core';

export interface List {
  item: number[];
}

export interface Vendor {
  items: List;
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

  maxNoOfItems: number = 5;
  item1: List = { item: [10, 20, 30, 40, 50] }
  item3: List = { item: [100, 200, 300, 400, 500] }
  item4: List = { item: [1010, 2020, 3030, 4040, 5050] }
  item2: List = { item: [60, 70] }
  r1: Round = {
    vendors: [
      { items: this.item1 },
      { items: this.item3 },
      { items: this.item4 }
    ]
  };
  r3: Round = {
    vendors: [
      { items: this.item1 },
      { items: this.item1 },
      { items: this.item1 }
    ]
  };
  r2: Round = {
    vendors: [
      { items: this.item2 },
      { items: this.item2 },
      { items: this.item2 }
    ]
  };
  listOfRound: Round[] = [this.r1, this.r2, this.r3, this.r2, this.r1];
  data2: Data = {
    rounds: this.listOfRound,
    rfxNumber: "20200812.23456"
  }


  d1 = {
    "rfxNumber": "20200812.23456",
    "round1": {
      "vendorCount": 3,
      "itemCount": 2,
      "vendor1Quote": {
        "item1": 10,
        "item2": 10
      },
      "vendor2Quote": {
        "item1": 9,
        "item2": 9
      },
      "vendor3Quote": {
        "item1": 8,
        "item2": 8
      }
    },
    "round2": {
      "vendorCount": 3,
      "itemCount": 2,
      "vendor1Quote": {
        "item1": 11,
        "item2": 11
      },
      "vendor2Quote": {
        "item1": 12,
        "item2": 12
      },
      "vendor3Quote": {
        "item1": 13,
        "item2": 14
      }
    },
    "round3": {
      "vendorCount": 3,
      "itemCount": 2,
      "vendor1Quote": {
        "item1": 31,
        "item2": 32
      },
      "vendor2Quote": {
        "item1": 42,
        "item2": 52
      },
      "vendor3Quote": {
        "item1": 53,
        "item2": 84
      }
    }

  }

  ngOnInit() {
    console.log(this.data2);
  }

  counter(i: number) {
    return new Array(i);
  }


}

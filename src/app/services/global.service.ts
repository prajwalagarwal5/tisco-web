import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  environment = "https://tslcorpsysqa.tatasteel.co.in:8182/DNF/api/rfqAnalytical/";

  constructor(private http: HttpClient) { }

  getErfxRoundData(data) {
    var url: string = this.environment + "getErfxRoundData/" + data;
    return this.http.get(url);
  }
}

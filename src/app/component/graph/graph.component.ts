import { Component, OnInit } from '@angular/core';
import { BitstampService } from '../../service/bitstamp/bitstamp.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent {
  public prices: Map<string, any> = new Map();
  public bidAsk: Map<string, string> = new Map();

  constructor(private bistampService: BitstampService) {
    this.bistampService.subscribeOrderBookUpdate$.subscribe((value) => {
      if (value.event === 'data') {
        this.bidAsk.set(`${value.currency.code}`, `${value.payload.asks}`);
      }
      if (value.event === '') {

      }
    });
  }

}

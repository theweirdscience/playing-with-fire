import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { timer } from 'rxjs/observable/timer';
import { filter, map, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { BitstampService } from '../../service/bitstamp/bitstamp.service';
import { Chart } from 'chart.js';
import { currencies, Currency } from '../../service/currency/currency.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnDestroy, AfterViewInit {
  // public bidAsk: Map<string, string> = new Map();
  public height = 600;

  private chart: Chart;
  private prices: Map<string, any[]> = new Map();
  private timer$: Subscription;
  private currencyPriceUpdaters$: Map<string, Subject<any>> = new Map();
  private currencyPriceUpdates$: Map<string, Subscription> = new Map();
  private tickerPrices$: Subscription;
  private normaliser: Map<string, any> = new Map();
  private latestPrices: Map<string, any> = new Map();

  private setNormaliser = (currency: Currency, price: any) => {
    this.normaliser.set(currency.code, price);
    this.addToChart(currency, price);
  };

  private addToChart = (currency: Currency, price: any) => {
    this.currencyPriceUpdaters$.get(currency.code).next(price / this.normaliser.get(currency.code) - 1);
  };

  constructor(private bistampService: BitstampService, private canvas: ElementRef) {
    currencies.map(currency => {
      const currencyPriceUpdate$ = new Subject<any>();
      this.currencyPriceUpdaters$.set(currency.code, currencyPriceUpdate$);
      this.currencyPriceUpdates$.set(currency.code, currencyPriceUpdate$.subscribe(value => this.latestPrices.set(currency.code, value)));
    });

    this.tickerPrices$ = this.bistampService.subscribeTradeTickerUpdate$.pipe(
      filter(value => value.event === 'trade'),
      map((value) => (this.normaliser.has(value.currency.code) ? this.addToChart : this.setNormaliser)(value.currency, value.payload.price))
    ).subscribe();

    const timer$ = timer(0, 1000).pipe(map(() => new Date()));
    this.timer$ = timer$.subscribe((t) => {
      this.chart.data.labels.push(t.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      this.prices.forEach((value, key) => value.push(this.latestPrices.get(key)));
      this.chart.data.datasets.forEach((dataset: any, i) => {
        dataset.data.push(this.latestPrices.get(currencies[i].code));
        // this.latestPrices.set(currencies[i].code, null);
      });
      this.chart.update();
    });
  }

  ngAfterViewInit(): void {
    const datasets = [];
    const colours = ['#e6194b', '#3cb44b', '#ffe119', '#0082c8', '#f58231', '#911eb4', '#46f0f0', '#f032e6', '#d2f53c', '#fabebe', '#008080', '#e6beff', '#aa6e28', '#fffac8', '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000080', '#808080', '#FFFFFF', '#000000'];
    currencies.map((currency, i) => {
      datasets.push({
        data: [],
        backgroundColor: colours[i],
        borderColor: colours[i],
        label: currency.code,
        fill: false,
        pointRadius: 1,
        borderWidth: 2,
        spanGaps: true
      });
    });
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        legend: {
          display: true,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.timer$.unsubscribe();
    this.tickerPrices$.unsubscribe();
    this.currencyPriceUpdates$.forEach(currencyPriceUpdate$ => currencyPriceUpdate$.unsubscribe());
  }
}

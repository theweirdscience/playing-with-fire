import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Chart } from 'chart.js';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { BitstampService } from '../../service/bitstamp/bitstamp.service';
import { currencies } from '../../service/currency/currency.service';

@Component({
  selector: 'app-relative-price-position',
  templateUrl: './relative-price-position.component.html',
  styleUrls: ['./relative-price-position.component.css']
})
export class RelativePricePositionComponent implements OnDestroy, AfterViewInit {
  private chart: Chart;

  public prices: Map<string, any> = new Map();
  public bidAsk: Map<string, any> = new Map();
  public report: IterableIterator<string>;

  private combinedSubscription$: Subscription;

  constructor(private bistampService: BitstampService) {

    const dataStream = this.bistampService.subscribeOrderBookUpdate$
      .pipe(
        filter(value => value.event === 'data'),
        map((value) => {
          return {
            'code': value.currency.code,
            'bid': value.payload.bids[0][0],
            'ask': value.payload.asks[0][0],
          };
        })
      );

    const tradeStream = this.bistampService.subscribeTradeTickerUpdate$
      .pipe(
        filter(value => value.event === 'trade'),
        map((value) => value.payload.price)
      );

    this.combinedSubscription$ = combineLatest(dataStream, tradeStream).subscribe((value: any) => {
      const t = new Date();
      this.chart.data.labels.push(t.toLocaleTimeString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      this.chart.data.datasets.forEach((dataset: any, index) => {
        dataset.data.push(currencies[index].code === value[0].code ? (value[0].ask - value[0].bid) / (value[1] - value[0].bid) : null);
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
    this.chart = new Chart('canvas2', {
      type: 'line',
      data: {
        labels: [],
        datasets: datasets
      },
      options: {
        legend: {
          display: false,
          position: 'bottom'
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: true,
            ticks: {
              min: 0,
            }
          }],

        }
      }
    });
  }

  ngOnDestroy() {
    this.combinedSubscription$.unsubscribe();
  }

}

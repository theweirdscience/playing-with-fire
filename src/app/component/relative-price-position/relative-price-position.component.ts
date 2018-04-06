import { Component, OnDestroy } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { merge } from 'rxjs/observable/merge';
import { filter, map, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { BitstampService } from '../../service/bitstamp/bitstamp.service';

@Component({
  selector: 'app-relative-price-position',
  templateUrl: './relative-price-position.component.html',
  styleUrls: ['./relative-price-position.component.css']
})
export class RelativePricePositionComponent implements OnDestroy {
  public prices: Map<string, any> = new Map();
  public bidAsk: Map<string, any> = new Map();
  public report: IterableIterator<string>;

  private combinedSubscription$: Subscription;

  constructor(private bistampService: BitstampService) {

    const dataStream = this.bistampService.subscribeOrderBookUpdate$
      .pipe(
        filter(value => value.event === 'data'),
        map((value) => this.bidAsk.set(`${value.currency.code}`, {
          'code': value.currency.code,
          'bid': value.payload.bids[0][0],
          'ask': value.payload.asks[0][0],
          'price': this.prices.get(value.currency.code)
        }))
      );

    const tradeStream = this.bistampService.subscribeTradeTickerUpdate$
      .pipe(
        filter(value => value.event === 'trade'),
        map((value) => this.prices.set(`${value.currency.code}`, `${value.payload.price}`))
      );

    this.combinedSubscription$ = merge(dataStream, tradeStream).subscribe(() => this.report = this.bidAsk.values());
  }

  ngOnDestroy() {
    this.combinedSubscription$.unsubscribe();
  }

}

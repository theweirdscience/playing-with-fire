import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import * as Pusher from 'pusher-js';
import { Observable } from 'rxjs/Observable';
import { from } from 'rxjs/observable/from';
import { tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { CurrencyPair, CurrencyService } from '../currency/currency.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class BitstampService implements OnDestroy {
  private socket: Pusher.Pusher;
  private closerMap: Map<string, () => void> = new Map();
  private subscriptions: Set<CurrencyPair> = new Set();
  private update$: Subscription;

  public subscribeOrderBookUpdate$: Observable<any>;
  public subscribeTradeTickerUpdate$: Observable<any>;

  private orderBookUpdate$ = new Subject();
  private tradeTickerUpdate$ = new Subject();

  getOrderBookUpdateHandler(pair: CurrencyPair) {
    return (context: any, data: any) => {
      // this.log.info(data);
      this.orderBookUpdate$.next({ 'event': context, 'currency': pair, 'payload': data });
    };
  }

  getTradeTickerUpdateHandler(pair: CurrencyPair) {
    return (context: any, data: any) => {
      // this.log.info(data);
      this.tradeTickerUpdate$.next({ 'event': context, 'currency': pair, 'payload': data });
    };
  }

  constructor(private log: Logger, private currencyService: CurrencyService) {
    this.log.info(this.currencyService);

    this.update$ = this.currencyService.subscribeActiveSetChange$.subscribe((active: Set<CurrencyPair>) => {
      // add new pairs
      active.forEach((pair) => {
        if (this.subscriptions.has(pair)) {
          return;
        }
        this.subscribe(pair);
      });
      // remove obsolete pairs
      this.subscriptions.forEach((pair) => {
        if (active.has(pair)) {
          return;
        }
        this.unsubscribe(pair);
      });
    });

    this.subscribeOrderBookUpdate$ = from(this.orderBookUpdate$);
    this.subscribeTradeTickerUpdate$ = from(this.tradeTickerUpdate$);
  }

  connect(key: string) {
    this.socket = new Pusher(key);
    this.socket.connection.bind('state_change', (states) => this.log.info(states));
  }

  subscribe(pair: CurrencyPair) {
    this.subscriptions.add(pair);

    const orderBookChannel = this.socket.subscribe(`order_book_${pair.lcode}`);
    const tradeTickerChannel = this.socket.subscribe(`live_trades_${pair.lcode}`);

    const orderBookUpdateHandler = this.getOrderBookUpdateHandler(pair);
    const tradeTickerUpdateHandler = this.getTradeTickerUpdateHandler(pair);

    orderBookChannel.bind_global(orderBookUpdateHandler);
    tradeTickerChannel.bind_global(tradeTickerUpdateHandler);

    this.closerMap.set(pair.code, () => {
      orderBookChannel.unbind_global(orderBookUpdateHandler);
      tradeTickerChannel.unbind_global(tradeTickerUpdateHandler);
    });
  }

  unsubscribe(pair: CurrencyPair) {
    this.closerMap.get(pair.code)();
    this.socket.unsubscribe(pair.lcode);
    this.subscriptions.delete(pair);
  }

  ngOnDestroy(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.update$.unsubscribe();
  }
}

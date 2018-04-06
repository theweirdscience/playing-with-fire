import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { FromObservable } from 'rxjs/observable/FromObservable';
import { PartialObserver } from 'rxjs/Observer';
import { combineLatest } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { Logger } from '../logger/logger.service';

const codeSymbol = Symbol('code');

export class Currency {
  public set code(value: string) {
    this[codeSymbol] = value.toUpperCase();
  }

  public get code(): string {
    return this[codeSymbol];
  }

  public get lcode(): string {
    return this[codeSymbol].toLowerCase();
  }

  constructor(public name: string, code: string) {
    this.code = code;
  }
}

export const BTC = new Currency('Bitcoin', 'BTC');
export const ETH = new Currency('Etherium', 'ETH');
export const XRP = new Currency('Ripple', 'XRP');
export const EUR = new Currency('Euro', 'EUR');
export const USD = new Currency('United States Dollar', 'USD');

export class CurrencyPair {
  constructor(public primary: Currency, public secondary: Currency) {
  }

  /**
   * Code of the currency pair in upper case;
   * @returns {string}
   */
  public get code(): string {
    return `${this.primary.code}${this.secondary.code}`;
  }

  /**
   * Code of the currency pair in lower case
   * @returns {string}
   */
  public get lcode(): string {
    return `${this.primary.lcode}${this.secondary.lcode}`;
  }
}

export const currencies: CurrencyPair[] = [
  new CurrencyPair(BTC, EUR),
  new CurrencyPair(EUR, USD),
  new CurrencyPair(XRP, USD),
  new CurrencyPair(XRP, EUR),
  new CurrencyPair(XRP, BTC),
  new CurrencyPair(ETH, USD),
  new CurrencyPair(ETH, EUR),
  new CurrencyPair(ETH, BTC),
];

// export const active: Observable.create(new Set<CurrencyPair>());

const activeSymbol = Symbol('active');

@Injectable()
export class CurrencyService {

  // public subscribeActiveSetChange$: Observable<any>;
  public activeSetChange$ = new Subject();

  constructor(@Inject(Logger) private log) {
    this[activeSymbol] = new Set<CurrencyPair>([]);

    // this.subscribeActiveSetChange$ = Observable.pipe(combineLatest(this.activeSetChange$));
  }

  public get active(): Set<CurrencyPair> {
    return this[activeSymbol];
  }

  enable(pair: CurrencyPair) {
    this.log.info(`enabling ${pair.code}`);
    this.active.add(pair);

    this.activeSetChange$.next(this[activeSymbol]);
  }

  disable(pair: CurrencyPair) {
    this.log.info(`disabling ${pair.code}`);
    this.active.delete(pair);

    this.activeSetChange$.next(this[activeSymbol]);
  }

}

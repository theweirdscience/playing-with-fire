import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CurrencyService, CurrencyPair, currencies } from '../../service/currency/currency.service';

@Component({
  selector: 'app-currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.css']
})
export class CurrencySelectComponent implements OnDestroy {
  public currencies: CurrencyPair[] = currencies;
  public active: Set<CurrencyPair> = new Set();
  private update$: Subscription;

  constructor(private currencyService: CurrencyService) {
    this.update$  = this.currencyService.subscribeActiveSetChange$.subscribe((active: Set<CurrencyPair>) => this.active = active);
  }

  change(currency, value) {
    value
        ? this.currencyService.enable(currency)
        : this.currencyService.disable(currency);
  }

  ngOnDestroy() {
    this.update$.unsubscribe();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { Logger } from '../../service/logger/logger.service';

@Component({
  selector: 'app-currency-select',
  templateUrl: './currency-select.component.html',
  styleUrls: ['./currency-select.component.css'],
  providers: [ Logger ]
})
export class CurrencySelectComponent implements OnInit {
  currencies: Set<any> = new Set([
    { name: 'BTC', checked: false },
    { name: 'ETH', checked: false },
    { name: 'XRP', checked: true }
  ]);

  constructor(private log: Logger) {}

  ngOnInit() {
  }

  change(e) {
    this.log.info(e);
  }

}

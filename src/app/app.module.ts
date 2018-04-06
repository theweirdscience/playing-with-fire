import { BrowserModule } from '@angular/platform-browser';
import { Inject, NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BitstampService } from './service/bitstamp/bitstamp.service';
import { CurrencyService } from './service/currency/currency.service';
import {Logger} from './service/logger/logger.service';
import {GraphComponent} from './component/graph/graph.component';
import {CurrencySelectComponent} from './component/currency-select/currency-select.component';
import {RelativePricePositionComponent} from './component/relative-price-position/relative-price-position.component';
import { SwitchComponent } from './widget/switch/switch.component';

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    CurrencySelectComponent,
    RelativePricePositionComponent,
    SwitchComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    Logger,
    CurrencyService,
    BitstampService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private bitstampService: BitstampService) {
    this.bitstampService.connect('de504dc5763aeef9ff52');
  }
}

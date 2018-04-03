import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from "rxjs/Observable";
import { CLEAR } from "./simple.reducer";

interface AppState {
  message: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message$: Observable<string>;

  constructor(private store: Store<AppState>) {
    this.message$ = this.store.pipe(select('message'));
  }

  clear() {
    //this.store.dispatch({type: CLEAR});
  }
}


import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  message = `see fire. must play.`;

  clear() {
    console.log(`clear!`);

    this.message = `oops! it's gone`;
  }
}

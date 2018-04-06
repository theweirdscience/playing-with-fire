import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent {
  @Input() name: string;
  @Input() checked: boolean;
  @Output() private change = new EventEmitter<boolean>();

  toggle() {
    this.change.emit(!this.checked);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export class SwitchEvent {
  constructor(public value: boolean, public target: SwitchComponent) {}
}

@Component({
  selector: 'app-switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css']
})
export class SwitchComponent implements OnInit {
  @Input() name: string;
  @Input() checked: boolean;
  @Output() private change = new EventEmitter<SwitchEvent>();

  constructor() {
  }

  ngOnInit() {
  }

  toggle() {
    this.checked = !this.checked;
    this.change.emit(new SwitchEvent(this.checked, this));
  }
}

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-ui-button',
  imports: [MatButtonModule],
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.scss',
})
export class UiButtonComponent {
  @Input() variant: 'raised' | 'flat' | 'basic' = 'basic';
  @Input() color: 'primary' | 'accent' | 'warn' | '' = '';
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<Event>();
}

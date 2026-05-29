import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ui-input',
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.scss',
})
export class UiInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() value = '';
  @Input() multiline = false;
  @Output() valueChange = new EventEmitter<string>();
  onModelChange(val: string) {
    this.valueChange.emit(val);
  }
}

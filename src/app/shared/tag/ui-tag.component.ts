import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-ui-tag',
  imports: [MatChipsModule],
  templateUrl: './ui-tag.component.html',
  styleUrl: './ui-tag.component.scss',
})
export class UiTagComponent {
  @Input() text!: string;
}

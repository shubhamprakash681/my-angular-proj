import { Component, signal } from '@angular/core';
import { FeedComponent } from './features/feed/feed.component';

@Component({
  selector: 'app-root',
  imports: [FeedComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('Meme Sharing App');
}

import { Component, inject, signal, computed } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ComposerComponent } from '../composer/composer.component';
import { PostDetailComponent } from '../post-detail/post-detail.component';
import { DatePipe } from '@angular/common';
import { UiCardComponent } from '../../shared/card/ui-card.component';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { UiInputComponent } from '../../shared/input/ui-input.component';
import { UiTagComponent } from '../../shared/tag/ui-tag.component';
import { MemeService } from '../../core/service/meme/meme.service';
import { SpoilerPipe } from '../../shared/pipe/spoiler.pipe';

@Component({
  selector: 'app-feed',
  imports: [
    UiCardComponent,
    UiButtonComponent,
    UiInputComponent,
    UiTagComponent,
    SpoilerPipe,
    DatePipe,
    MatDialogModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  memeService = inject(MemeService);
  dialog = inject(MatDialog);
  searchQuery = signal('');

  filteredPosts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const posts = this.memeService.enrichedPosts();
    if (!query) return posts;
    return posts.filter(
      (p) => p.body.toLowerCase().includes(query) || p.title?.toLowerCase().includes(query),
    );
  });

  openComposer() {
    this.dialog.open(ComposerComponent, { width: '500px' });
  }

  openDetail(postId: string) {
    this.dialog.open(PostDetailComponent, { data: { postId }, width: '600px' });
  }
}

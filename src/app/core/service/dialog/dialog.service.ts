import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ComposerComponent } from '../../../features/composer/composer.component';
import { PostDetailComponent } from '../../../features/post-detail/post-detail.component';
import { EnrichedPost } from '../../models/meme.model';

@Injectable({ providedIn: 'root' })
export class DialogService {
  private dialog = inject(MatDialog);

  openComposer(post?: EnrichedPost) {
    return this.dialog.open(ComposerComponent, {
      data: post ? { post } : null,
      width: '560px',
      maxWidth: 'calc(100vw - 24px)',
      autoFocus: false,
    });
  }

  openPostDetail(postId: string) {
    return this.dialog.open(PostDetailComponent, {
      data: { postId },
      width: '720px',
      maxWidth: 'calc(100vw - 24px)',
      autoFocus: false,
    });
  }
}

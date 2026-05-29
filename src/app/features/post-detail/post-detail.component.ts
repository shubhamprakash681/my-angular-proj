import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
  MatDialog,
} from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ComposerComponent } from '../composer/composer.component';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { UiTagComponent } from '../../shared/tag/ui-tag.component';
import { SpoilerPipe } from '../../shared/pipe/spoiler.pipe';
import { MemeService } from '../../core/service/meme/meme.service';

@Component({
  selector: 'app-post-detail',
  imports: [UiButtonComponent, UiTagComponent, SpoilerPipe, DatePipe, MatDialogModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<PostDetailComponent>);
  dialog = inject(MatDialog);
  memeService = inject(MemeService);

  get post() {
    return this.memeService.enrichedPosts().find((p) => p.id === this.data.postId);
  }

  copyLink() {
    navigator.clipboard.writeText(`meme-app://post/${this.post?.id}`);
    alert('Link copied to clipboard!');
  }

  deletePost() {
    this.memeService.deletePost(this.post!.id);
    this.dialogRef.close();
  }
  editPost() {
    this.dialog.open(ComposerComponent, { data: { post: this.post } });
  }
}

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { UiTagComponent } from '../../shared/tag/ui-tag.component';
import { UiInputComponent } from '../../shared/input/ui-input.component';
import { UiSpoilerTextComponent } from '../../shared/spoiler/ui-spoiler-text.component';
import { MemeService } from '../../core/service/meme/meme.service';
import { DialogService } from '../../core/service/dialog/dialog.service';

type PostDetailData = {
  postId: string;
};

@Component({
  selector: 'app-post-detail',
  imports: [UiButtonComponent, UiTagComponent, UiInputComponent, UiSpoilerTextComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent {
  data = inject<PostDetailData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<PostDetailComponent>);
  memeService = inject(MemeService);
  private dialog = inject(DialogService);

  flagReason = '';
  statusMessage = '';
  confirmDelete = false;

  get post() {
    return this.memeService.enrichedPosts().find((p) => p.id === this.data.postId);
  }

  async copyLink() {
    if (!this.post) return;
    const token = `meme-app://post/${this.post.id}`;
    try {
      await navigator.clipboard.writeText(token);
      this.statusMessage = 'Share token copied.';
    } catch {
      this.statusMessage = token;
    }
  }

  deletePost() {
    if (!this.post) return;
    if (!this.confirmDelete) {
      this.confirmDelete = true;
      return;
    }
    this.memeService.deletePost(this.post.id);
    this.dialogRef.close();
  }

  editPost() {
    if (!this.post) return;
    this.dialog.openComposer(this.post);
  }

  reportPost() {
    if (!this.post) return;
    this.memeService.flagPost(this.post.id, this.flagReason);
    this.flagReason = '';
    this.statusMessage = 'Report saved for review.';
  }

  relativeTime(timestamp: number) {
    const seconds = Math.max(1, Math.floor((Date.now() - timestamp) / 1000));
    const units = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
    ];
    const unit = units.find((item) => seconds >= item.seconds);
    if (!unit) return 'just now';
    const value = Math.floor(seconds / unit.seconds);
    return `${value} ${unit.label}${value === 1 ? '' : 's'} ago`;
  }
}

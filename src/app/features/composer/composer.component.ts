import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { UiInputComponent } from '../../shared/input/ui-input.component';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { StorageService } from '../../core/service/storage/storage.service';
import { MemeService } from '../../core/service/meme/meme.service';

@Component({
  selector: 'app-composer',
  imports: [UiInputComponent, UiButtonComponent, MatDialogModule],
  templateUrl: './composer.component.html',
  styleUrl: './composer.component.scss',
})
export class ComposerComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ComposerComponent>);
  data = inject(MAT_DIALOG_DATA);
  storage = inject(StorageService);
  memeService = inject(MemeService);

  title = '';
  body = '';
  tags = '';
  mood = 'Neutral';

  get draftKey() {
    const userId = this.memeService.currentUser().id;
    return this.data?.post ? `draft:${userId}:post:${this.data.post.id}` : `draft:${userId}:new`;
  }

  ngOnInit() {
    const draft = this.storage.getItem<any>(this.draftKey);
    if (draft) {
      this.title = draft.title || '';
      this.body = draft.body || '';
      this.tags = draft.tags || '';
      this.mood = draft.mood || 'Neutral';
    } else if (this.data?.post) {
      this.title = this.data.post.title || '';
      this.body = this.data.post.body;
      this.tags = this.data.post.tags.join(', ');
      this.mood = this.data.post.mood;
    }
  }

  saveDraft() {
    this.storage.setItem(this.draftKey, {
      title: this.title,
      body: this.body,
      tags: this.tags,
      mood: this.mood,
    });
  }

  submit() {
    const trimmedBody = this.body.trim();
    if (!trimmedBody) return alert('Body is required');

    const postData = {
      title: this.title,
      body: trimmedBody,
      tags: this.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      mood: this.mood,
    };

    this.data?.post
      ? this.memeService.updatePost(this.data.post.id, postData)
      : this.memeService.addPost(postData);

    this.storage.removeItem(this.draftKey);
    this.dialogRef.close(true);
  }
}

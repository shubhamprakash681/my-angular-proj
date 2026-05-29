import { Component, inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UiInputComponent } from '../../shared/input/ui-input.component';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { MemeService } from '../../core/service/meme/meme.service';
import { EnrichedPost, PostDraft } from '../../core/models/meme.model';

type ComposerData = {
  post?: EnrichedPost;
} | null;

@Component({
  selector: 'app-composer',
  imports: [UiInputComponent, UiButtonComponent],
  templateUrl: './composer.component.html',
  styleUrl: './composer.component.scss',
})
export class ComposerComponent implements OnInit {
  dialogRef = inject(MatDialogRef<ComposerComponent>);
  data = inject<ComposerData>(MAT_DIALOG_DATA);
  memeService = inject(MemeService);

  readonly moods = ['Happy', 'Frustrated', 'Chaotic', 'Optimistic', 'Neutral'];

  title = '';
  body = '';
  tags = '';
  mood = 'Neutral';
  error = '';

  ngOnInit() {
    const draft = this.memeService.getDraft(this.data?.post?.id);
    if (draft) {
      this.applyDraft(draft);
    } else if (this.data?.post) {
      this.title = this.data.post.title || '';
      this.body = this.data.post.body;
      this.tags = this.data.post.tags.join(', ');
      this.mood = this.data.post.mood;
    }
  }

  saveDraft() {
    this.memeService.saveDraft(
      {
        title: this.title,
        body: this.body,
        tags: this.tags,
        mood: this.mood,
      },
      this.data?.post?.id,
    );
  }

  updateMood(event: Event) {
    this.mood = event.target instanceof HTMLSelectElement ? event.target.value : 'Neutral';
    this.saveDraft();
  }

  submit() {
    const trimmedBody = this.body.trim();
    if (!trimmedBody) {
      this.error = 'Body is required.';
      return;
    }

    const postData = {
      title: this.title.trim() || undefined,
      body: trimmedBody,
      tags: this.tags
        .split(',')
        .map((tag) => tag.trim().replace(/^#/, ''))
        .filter(Boolean),
      mood: this.mood || 'Neutral',
    };

    this.data?.post
      ? this.memeService.updatePost(this.data.post.id, postData)
      : this.memeService.addPost(postData);

    this.memeService.removeDraft(this.data?.post?.id);
    this.dialogRef.close(true);
  }

  private applyDraft(draft: PostDraft) {
    this.title = draft.title || '';
    this.body = draft.body || '';
    this.tags = draft.tags || '';
    this.mood = draft.mood || 'Neutral';
  }
}

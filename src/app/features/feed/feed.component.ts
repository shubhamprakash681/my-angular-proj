import { Component, inject } from '@angular/core';
import { UiCardComponent } from '../../shared/card/ui-card.component';
import { UiButtonComponent } from '../../shared/button/ui-button.component';
import { UiInputComponent } from '../../shared/input/ui-input.component';
import { UiTagComponent } from '../../shared/tag/ui-tag.component';
import { MemeService } from '../../core/service/meme/meme.service';
import { DialogService } from '../../core/service/dialog/dialog.service';
import { UiSpoilerTextComponent } from '../../shared/spoiler/ui-spoiler-text.component';

@Component({
  selector: 'app-feed',
  imports: [UiCardComponent, UiButtonComponent, UiInputComponent, UiTagComponent, UiSpoilerTextComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  memeService = inject(MemeService);
  private dialog = inject(DialogService);

  updateSearch(search: string) {
    this.memeService.updatePreferences({ search });
  }

  updateTeam(event: Event) {
    this.memeService.updatePreferences({ team: this.valueFromEvent(event) });
  }

  updateMood(event: Event) {
    this.memeService.updatePreferences({ mood: this.valueFromEvent(event) });
  }

  updateSort(event: Event) {
    const value = this.valueFromEvent(event);
    this.memeService.updatePreferences({ sort: value === 'oldest' ? 'oldest' : 'newest' });
  }

  toggleTag(tag: string) {
    const selected = this.memeService.preferences().tags;
    this.memeService.updatePreferences({
      tags: selected.includes(tag) ? selected.filter((item) => item !== tag) : [...selected, tag],
    });
  }

  toggleSavedOnly(event: Event) {
    this.memeService.updatePreferences({ savedOnly: this.checkedFromEvent(event) });
  }

  toggleLikedOnly(event: Event) {
    this.memeService.updatePreferences({ likedOnly: this.checkedFromEvent(event) });
  }

  openComposer() {
    this.dialog.openComposer();
  }

  openDetail(postId: string) {
    this.dialog.openPostDetail(postId);
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

  private valueFromEvent(event: Event) {
    return event.target instanceof HTMLSelectElement ? event.target.value : '';
  }

  private checkedFromEvent(event: Event) {
    return event.target instanceof HTMLInputElement ? event.target.checked : false;
  }
}

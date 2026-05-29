import { Component, Input, OnChanges } from '@angular/core';

type TextPart = {
  text: string;
  spoiler: boolean;
  revealed: boolean;
};

@Component({
  selector: 'app-ui-spoiler-text',
  templateUrl: './ui-spoiler-text.component.html',
  styleUrl: './ui-spoiler-text.component.scss',
})
export class UiSpoilerTextComponent implements OnChanges {
  @Input() text = '';
  @Input() preview = false;

  parts: TextPart[] = [];

  ngOnChanges() {
    this.parts = this.parse(this.text);
  }

  revealAll() {
    this.parts = this.parts.map((part) => ({ ...part, revealed: part.spoiler || part.revealed }));
  }

  collapseAll() {
    this.parts = this.parts.map((part) => ({ ...part, revealed: false }));
  }

  toggleSpoiler(index: number) {
    this.parts = this.parts.map((part, currentIndex) =>
      currentIndex === index ? { ...part, revealed: !part.revealed } : part,
    );
  }

  get hasSpoilers() {
    return this.parts.some((part) => part.spoiler);
  }

  private parse(value: string) {
    const parts: TextPart[] = [];
    const regex = /\|\|(.*?)\|\|/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(value)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: value.slice(lastIndex, match.index),
          spoiler: false,
          revealed: false,
        });
      }

      parts.push({
        text: match[1],
        spoiler: true,
        revealed: false,
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < value.length) {
      parts.push({
        text: value.slice(lastIndex),
        spoiler: false,
        revealed: false,
      });
    }

    return parts.length ? parts : [{ text: value, spoiler: false, revealed: false }];
  }
}

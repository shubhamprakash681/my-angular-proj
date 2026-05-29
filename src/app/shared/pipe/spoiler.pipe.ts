import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({ name: 'spoiler' })
export class SpoilerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    if (!value) return '';
    // Parse ||text|| into a span that toggles 'revealed' class on click
    const parsed = value.replace(
      /\|\|(.*?)\|\|/g,
      '<span class="spoiler-text" onclick="this.classList.toggle(\'revealed\')">$1</span>',
    );
    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  }
}

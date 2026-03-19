import {
  Injectable,
  signal,
  PLATFORM_ID,
  inject,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ScrollStateService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);

  readonly isScrolled = signal(false);
  readonly scrollY = signal(0);
  readonly activeSection = signal('hero');

  private listening = false;

  startListening(threshold = 100): void {
    if (!isPlatformBrowser(this.platformId) || this.listening) return;
    this.listening = true;

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        this.scrollY.set(y);
        this.isScrolled.set(y > threshold);
      }, { passive: true });
    });
  }

  setActiveSection(section: string): void {
    this.activeSection.set(section);
  }
}

import {
  Component,
  inject,
  afterNextRender,
  ElementRef,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ScrollStateService } from '../../core/services/scroll-state.service';
import { GsapService } from '../../core/services/gsap.service';

@Component({
  selector: 'dp-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnDestroy {
  protected readonly scrollState = inject(ScrollStateService);
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);

  readonly ctaButton = viewChild<ElementRef>('ctaButton');

  private cleanup: (() => void) | null = null;
  private magnetCleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(async () => {
      this.scrollState.startListening(100);

      // Magnetic hover on CTA button
      const cta = this.ctaButton()?.nativeElement;
      if (cta && this.gsapService.isBrowser) {
        const gsap = await this.gsapService.loadGsap();
        if (!gsap) return;

        const onMove = (e: MouseEvent) => {
          const rect = cta.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          gsap.to(cta, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: 'power2.out',
          });
        };
        const onLeave = () => {
          gsap.to(cta, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        };

        cta.addEventListener('mousemove', onMove);
        cta.addEventListener('mouseleave', onLeave);
        this.magnetCleanup = () => {
          cta.removeEventListener('mousemove', onMove);
          cta.removeEventListener('mouseleave', onLeave);
        };
      }
    });
  }

  scrollTo(sectionId: string, event: Event): void {
    event.preventDefault();
    if (!this.gsapService.isBrowser) return;
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  ngOnDestroy(): void {
    this.cleanup?.();
    this.magnetCleanup?.();
  }
}

import {
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  OnDestroy,
} from '@angular/core';
import { GsapService } from '../services/gsap.service';

@Directive({
  selector: '[dpFadeUp]',
})
export class FadeUpDirective implements OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly gsapService = inject(GsapService);

  readonly dpFadeUpDelay = input(0);
  readonly dpFadeUpDistance = input(40);

  private cleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(async () => {
      const gsap = await this.gsapService.loadGsap();
      const ScrollTrigger = await this.gsapService.loadScrollTrigger();
      if (!gsap || !ScrollTrigger) return;

      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          gsap.from(this.el.nativeElement, {
            y: this.dpFadeUpDistance(),
            opacity: 0,
            duration: 1,
            delay: this.dpFadeUpDelay(),
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });
        }
      ));
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

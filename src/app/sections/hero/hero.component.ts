import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  OnDestroy,
  viewChild,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';
import { ScrollStateService } from '../../core/services/scroll-state.service';

@Component({
  selector: 'dp-hero',
  templateUrl: './hero.component.html',
})
export class HeroComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly scrollState = inject(ScrollStateService);
  private readonly el = inject(ElementRef);

  readonly heroSection = viewChild<ElementRef>('heroSection');

  private cleanup: (() => void) | null = null;

  constructor() {
    afterNextRender(async () => {
      const gsap = await this.gsapService.loadGsap();
      const ScrollTrigger = await this.gsapService.loadScrollTrigger();
      if (!gsap || !ScrollTrigger) return;

      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          // Staggered entrance animation
          const tl = gsap.timeline({
            defaults: { ease: 'power3.out' },
          });

          tl.from('.hero-overline', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
          })
          .from('.hero-title-line', {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
          }, '-=0.4')
          .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 0.8,
          }, '-=0.5')
          .from('.hero-cta', {
            y: 20,
            opacity: 0,
            duration: 0.6,
          }, '-=0.3');

          // Parallax on hero image
          gsap.to('.hero-image', {
            yPercent: 20,
            ease: 'none',
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            },
          });

          // Navbar morph trigger
          ScrollTrigger.create({
            trigger: this.el.nativeElement,
            start: 'top top',
            end: '80% top',
            onLeave: () => this.scrollState.setActiveSection('content'),
            onEnterBack: () => this.scrollState.setActiveSection('hero'),
          });
        }
      ));
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

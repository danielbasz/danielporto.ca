import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  OnDestroy,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';

interface ManifestoLine {
  words: string[];
  style: 'heading' | 'body' | 'accent';
}

@Component({
  selector: 'dp-philosophy',
  templateUrl: './philosophy.component.html',
})
export class PhilosophyComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);
  private cleanup: (() => void) | null = null;

  readonly lines: ManifestoLine[] = [
    {
      words: "I like building things and figuring things out —".split(' '),
      style: 'heading',
    },
    {
      words: "the domain has never mattered.".split(' '),
      style: 'heading',
    },
    {
      words: "Live television for a hundred million viewers. Government software for a nation. Cameras, code, pipelines, people — every problem is just a new toolkit waiting to click.".split(' '),
      style: 'body',
    },
    {
      words: "The tools change. The curiosity doesn't.".split(' '),
      style: 'accent',
    },
  ];

  getLineClasses(style: string): string {
    switch (style) {
      case 'heading':
        return 'philosophy-line text-3xl md:text-5xl lg:text-6xl font-display font-bold text-cream leading-[1.1] mb-4';
      case 'body':
        return 'philosophy-line text-lg md:text-2xl lg:text-3xl text-cream/80 font-serif italic leading-relaxed mb-8 mt-6';
      case 'accent':
        return 'philosophy-line text-2xl md:text-4xl lg:text-5xl font-display font-bold text-clay leading-[1.1] mt-4';
      default:
        return '';
    }
  }

  constructor() {
    afterNextRender(async () => {
      const gsap = await this.gsapService.loadGsap();
      const ScrollTrigger = await this.gsapService.loadScrollTrigger();
      if (!gsap || !ScrollTrigger) return;

      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          const words = this.el.nativeElement.querySelectorAll('.word');

          // Set initial state
          gsap.set(words, { opacity: 0.1 });

          // Word-by-word reveal on scroll
          gsap.to(words, {
            opacity: 1,
            stagger: { each: 0.03 },
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top top',
              end: 'bottom 60%',
              scrub: 1,
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

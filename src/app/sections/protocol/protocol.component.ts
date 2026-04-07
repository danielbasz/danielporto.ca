import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  OnDestroy,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';
import { FadeUpDirective } from '../../core/directives/fade-up.directive';

interface ProjectCard {
  number: string;
  label: string;
  title: string;
  subtitle: string;
  narrative: string[];
  tags: string[];
}

@Component({
  selector: 'dp-protocol',
  imports: [FadeUpDirective],
  templateUrl: './protocol.component.html',
})
export class ProtocolComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);
  private cleanup: (() => void) | null = null;

  readonly projects: ProjectCard[] = [
    {
      number: '01',
      label: 'Developer',
      title: 'Canada Revenue Agency',
      subtitle: 'Software Developer — Ottawa, 2022–2025',
      narrative: [
        'Built and maintained enterprise web applications in Angular and Java for one of Canada\'s largest federal organizations. Migrated legacy Swing and WebLogic interfaces to modern web frameworks. Wrote comprehensive automated test suites and maintained security-critical dependency chains.',
        'Completed the IT Apprenticeship Program — a rigorous year-long assessment — and earned recommendation for reclassification. Led production support rotations in a Microsoft 365 environment: when systems went down, I was the one reading logs, tracing root causes, and restoring services. Trained new hires, drove modernization initiatives, and shipped code that serves millions of Canadians.',
      ],
      tags: ['Angular', 'TypeScript', 'Java', 'REST APIs', 'JUnit', 'Production Support', 'Legacy Migration'],
    },
    {
      number: '02',
      label: 'Editor & Automator',
      title: 'Globo TV — Rede Globo',
      subtitle: 'Cinema Editor → Content Editor — Rio de Janeiro, 2017–2020',
      narrative: [
        'In Brazil, Tela Quente and Sessão da Tarde aren\'t just TV slots — they\'re institutions. Every Brazilian grows up watching movies on those programs. I was the editor making those broadcasts happen for over 100 million viewers.',
        'Every frame demanded precision: age restriction classifications, closed captions, multi-language audio tracks, visual information overlays, and narrative story coherence. When a live program like Big Brother ran 15 minutes over, I trimmed feature films on the spot — cutting scenes while preserving the story\'s emotional arc. In live television, there are no second takes.',
        'Later, as Content Editor, I moved upstream — building Python automation pipelines that pulled data from APIs, rendered it through After Effects templates, and produced broadcast-ready content that had previously taken hours of manual work.',
      ],
      tags: ['AVID', 'Premiere', 'After Effects', 'Python', 'API Pipelines', '100M+ Viewers', 'Live Broadcast'],
    },
    {
      number: '03',
      label: 'Technical Director',
      title: 'Andarilho Filmes',
      subtitle: 'Co-Founder — Rio de Janeiro, 2012–Present',
      narrative: [
        'Co-founded a production company and owned every technical system — AV equipment procurement, setup, and maintenance; cameras, lighting, audio, post-production, IT infrastructure. From wedding coverage with zero margin for error to a year-long embedded production at Rock in Rio — troubleshooting gear in real time during live performances — I learned that creative work is equal parts artistry and logistics.',
        'The company has since pivoted to musical theatre, producing award-winning shows including Elvis and Bonnie & Clyde. Today I consult remotely on marketing strategy: building campaigns that drive ticket pre-sales, creating investor presentations that demonstrate ROI, and reviewing every creative asset for both visual quality and strategic alignment.',
      ],
      tags: ['Cinematography', 'Rock in Rio', 'Musical Theatre', 'Marketing Strategy', 'Live Events', 'IT Systems'],
    },
  ];

  private readonly FRAME_COUNT = 28;

  constructor() {
    afterNextRender(async () => {
      // Preload all aurora frames
      for (let i = 1; i <= this.FRAME_COUNT; i++) {
        const img = new Image();
        img.src = `assets/images/aurora-frames/aurora-frame-${String(i).padStart(3, '0')}.webp`;
      }

      const gsap = await this.gsapService.loadGsap();
      const ScrollTrigger = await this.gsapService.loadScrollTrigger();
      if (!gsap || !ScrollTrigger) return;

      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          const cards: HTMLElement[] = Array.from(
            this.el.nativeElement.querySelectorAll('.protocol-card')
          );

          cards.forEach((card, i) => {
            // Scale down + fade out + blur when covered by next card (skip last)
            if (i < cards.length - 1) {
              gsap.to(card, {
                scale: 0.9,
                opacity: 0,
                filter: 'blur(4px)',
                transformOrigin: 'center top',
                scrollTrigger: {
                  trigger: cards[i + 1],
                  start: 'top bottom',
                  end: 'top 60%',
                  scrub: true,
                },
              });
            }
          });

          // Scroll-synced aurora frame sequence
          const frameImg = this.el.nativeElement.querySelector('.aurora-frame');
          if (frameImg) {
            let currentFrame = -1;
            gsap.to({ frame: 0 }, {
              frame: this.FRAME_COUNT - 1,
              ease: 'none',
              scrollTrigger: {
                trigger: this.el.nativeElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                onUpdate: (self: any) => {
                  const idx = Math.round(self.progress * (this.FRAME_COUNT - 1));
                  if (idx !== currentFrame) {
                    currentFrame = idx;
                    frameImg.src = `assets/images/aurora-frames/aurora-frame-${String(idx + 1).padStart(3, '0')}.webp`;
                  }
                },
              },
            });
          }

        }
      ));
    });
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

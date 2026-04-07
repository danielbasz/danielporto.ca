import {
  Component,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  OnDestroy,
  signal,
  computed,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';

interface ContentPiece {
  format: string;
  accent: string;
  text: string;
  source: string;
}

@Component({
  selector: 'dp-content-card',
  host: { class: 'block' },
  templateUrl: './content-card.component.html',
  styles: [`
    .cursor {
      animation: blink 1s step-end infinite;
    }
    @keyframes blink {
      50% { opacity: 0; }
    }
  `],
})
export class ContentCardComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private cleanup: (() => void) | null = null;
  private typeTimer: ReturnType<typeof setInterval> | null = null;
  private pauseTimer: ReturnType<typeof setTimeout> | null = null;
  private hasStarted = false;

  readonly activeIndex = signal(0);
  readonly displayedText = signal('');
  readonly activePiece = computed(() => this.pieces[this.activeIndex()]);

  readonly pieces: ContentPiece[] = [
    {
      format: 'Broadcast',
      accent: '#CC5833',
      text: 'Festival draws record 100K+ viewers on opening night — live coverage starting at 8PM.',
      source: 'Daily Bulletin · GloboTV',
    },
    {
      format: 'Edit Suite',
      accent: '#3D5548',
      text: 'Final cut locked. Color grade approved. Audio mix at -24 LUFS. Package cleared for broadcast.',
      source: 'Post-Production · GloboTV',
    },
    {
      format: 'Production',
      accent: '#3178C6',
      text: 'HYDE — A short film exploring identity through movement and light. Dir. D. Porto.',
      source: 'Andarilho Filmes · Short Film',
    },
    {
      format: 'Campaign',
      accent: '#E07050',
      text: 'From concept to curtain call. Full creative production for live theatre and events.',
      source: 'Andarilho · Client Services',
    },
    {
      format: 'Brief',
      accent: '#FFD43B',
      text: 'Deliverables: 3x social clips, 1x aftermovie, event photography. Timeline: 2 weeks.',
      source: 'Project Scope · Arts Festival',
    },
  ];

  constructor() {
    afterNextRender(async () => {
      const gsap = await this.gsapService.loadGsap();
      await this.gsapService.loadScrollTrigger();
      if (!gsap) return;

      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          gsap.from('.card-wrapper', {
            y: 60,
            opacity: 0,
            duration: 1,
            delay: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => this.zone.run(() => this.startTyping()),
            },
          });
        }
      ));
    });
  }

  private startTyping() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.typeNext();
  }

  private typeNext() {
    const piece = this.pieces[this.activeIndex()];
    const text = piece.text;
    let charIndex = 0;
    this.displayedText.set('');

    this.typeTimer = setInterval(() => {
      charIndex++;
      this.displayedText.set(text.slice(0, charIndex));

      if (charIndex >= text.length) {
        if (this.typeTimer) clearInterval(this.typeTimer);

        this.pauseTimer = setTimeout(() => {
          this.activeIndex.set((this.activeIndex() + 1) % this.pieces.length);
          this.typeNext();
        }, 2500);
      }
    }, 45);
  }

  ngOnDestroy(): void {
    if (this.typeTimer) clearInterval(this.typeTimer);
    if (this.pauseTimer) clearTimeout(this.pauseTimer);
    this.cleanup?.();
  }
}

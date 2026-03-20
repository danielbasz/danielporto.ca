import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';

interface CodeSnippet {
  language: string;
  label: string;
  accent: string;
  code: string;
}

@Component({
  selector: 'dp-developer-card',
  host: { class: 'block' },
  templateUrl: './developer-card.component.html',
})
export class DeveloperCardComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);
  private cleanup: (() => void) | null = null;
  private gsap: any = null;
  private isAnimating = false;

  readonly activeIndex = signal(0);

  readonly snippets: CodeSnippet[] = [
    {
      language: 'TypeScript',
      label: 'Angular Component',
      accent: '#3178C6',
      code: `@Component({
  selector: 'app-assessment',
  template: \`
    @if (isValid()) {
      <dp-summary [data]="form" />
    }
  \`
})`,
    },
    {
      language: 'Java',
      label: 'Spring REST',
      accent: '#E76F00',
      code: `@GetMapping("/api/records/{id}")
public ResponseEntity<Record>
    getRecord(@PathVariable String id) {
  return service.findById(id)
    .map(ResponseEntity::ok)
    .orElse(notFound().build());
}`,
    },
    {
      language: 'Python',
      label: 'Automation Pipeline',
      accent: '#FFD43B',
      code: `def render_bulletin(data: dict) -> Path:
    comp = aequery.Composition("Daily")
    for layer in comp.layers:
        if layer.name in data:
            layer.text = data[layer.name]
    return comp.render(format="h264")`,
    },
    {
      language: 'SQL',
      label: 'Data Query',
      accent: '#CC5833',
      code: `SELECT t.file_id,
       SUM(a.amount) AS total
FROM assessments a
JOIN tax_files t
  ON t.id = a.file_id
WHERE a.tax_year = 2024
GROUP BY t.file_id;`,
    },
    {
      language: 'Angular',
      label: 'New Control Flow',
      accent: '#DD0031',
      code: `<section class="grid grid-cols-3">
  @for (item of items(); track item.id) {
    <dp-card
      [data]="item"
      (selected)="onSelect($event)" />
  }
</section>`,
    },
  ];

  constructor() {
    afterNextRender(async () => {
      const gsap = await this.gsapService.loadGsap();
      await this.gsapService.loadScrollTrigger();
      if (!gsap) return;
      this.gsap = gsap;

      // Position the card stack immediately
      this.positionStack(false);

      // Entrance animation on scroll
      this.cleanup = (await this.gsapService.createContext(
        this.el.nativeElement,
        (gsap) => {
          gsap.from('.card-wrapper', {
            y: 60,
            opacity: 0,
            duration: 1,
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

  private getSnippetCards(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll('.snippet-card')
    );
  }

  private positionStack(animate: boolean) {
    if (!this.gsap) return;
    const cards = this.getSnippetCards();
    const total = this.snippets.length;
    const active = this.activeIndex();

    cards.forEach((card, i) => {
      const pos = (i - active + total) % total;
      const isVisible = pos < 3;

      this.gsap.to(card, {
        y: pos * 8,
        x: pos * 4,
        rotation: pos * 1.5,
        scale: 1 - pos * 0.03,
        opacity: isVisible ? 1 - pos * 0.25 : 0,
        zIndex: total - pos,
        duration: animate ? 0.5 : 0,
        ease: 'power3.out',
      });
    });
  }

  async shuffle() {
    if (this.isAnimating || !this.gsap) return;
    this.isAnimating = true;

    const cards = this.getSnippetCards();
    const active = this.activeIndex();
    const topCard = cards[active];

    // Animate top card out to the right
    await new Promise<void>((resolve) => {
      this.gsap.to(topCard, {
        x: 300,
        rotation: 15,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: resolve,
      });
    });

    // Update active index
    const next = (active + 1) % this.snippets.length;
    this.activeIndex.set(next);

    // Reset the departed card to neutral position
    this.gsap.set(topCard, { x: 0, rotation: 0, opacity: 0 });

    // Reposition the stack with animation
    this.positionStack(true);

    this.isAnimating = false;
  }

  ngOnDestroy(): void {
    this.cleanup?.();
  }
}

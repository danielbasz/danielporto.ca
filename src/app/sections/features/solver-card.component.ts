import {
  Component,
  ElementRef,
  NgZone,
  afterNextRender,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { GsapService } from '../../core/services/gsap.service';

interface Task {
  label: string;
  domain: string;
  accent: string;
  done: boolean;
}

@Component({
  selector: 'dp-solver-card',
  host: { class: 'block' },
  templateUrl: './solver-card.component.html',
  styles: [`
    .check-enter {
      animation: checkPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes checkPop {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .strike-through {
      text-decoration: line-through;
      text-decoration-color: rgba(242, 240, 233, 0.15);
    }
  `],
})
export class SolverCardComponent implements OnDestroy {
  private readonly gsapService = inject(GsapService);
  private readonly el = inject(ElementRef);
  private readonly zone = inject(NgZone);
  private cleanup: (() => void) | null = null;
  private stepTimer: ReturnType<typeof setTimeout> | null = null;
  private hasStarted = false;

  readonly completedCount = signal(0);
  readonly currentPhase = signal('Planning');

  readonly tasks = signal<Task[]>([
    { label: 'Migrate legacy form to Angular 21', domain: 'Dev', accent: '#3178C6', done: false },
    { label: 'Render daily bulletin template', domain: 'Content', accent: '#CC5833', done: false },
    { label: 'Dockerize staging environment', domain: 'Infra', accent: '#3D5548', done: false },
    { label: 'QC broadcast package for air', domain: 'Content', accent: '#CC5833', done: false },
    { label: 'Write API integration tests', domain: 'Dev', accent: '#3178C6', done: false },
    { label: 'Draft campaign brief for client', domain: 'Strategy', accent: '#E07050', done: false },
    { label: 'Set up CI/CD pipeline', domain: 'Infra', accent: '#3D5548', done: false },
  ]);

  private readonly phases = ['Planning', 'In Progress', 'Reviewing', 'Shipped'];

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
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: this.el.nativeElement,
              start: 'top 85%',
              toggleActions: 'play none none none',
              onEnter: () => this.zone.run(() => this.startSequence()),
            },
          });
        }
      ));
    });
  }

  private startSequence() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.currentPhase.set('In Progress');
    this.completeNext(0);
  }

  private completeNext(index: number) {
    const current = this.tasks();
    if (index >= current.length) {
      // All done — show shipped, then reset after a pause
      this.currentPhase.set('Shipped');
      this.stepTimer = setTimeout(() => this.resetAndReplay(), 3000);
      return;
    }

    // Update phase at midpoint
    if (index === Math.floor(current.length / 2)) {
      this.currentPhase.set('Reviewing');
    }

    this.stepTimer = setTimeout(() => {
      const updated = current.map((t, i) =>
        i === index ? { ...t, done: true } : t
      );
      this.tasks.set(updated);
      this.completedCount.set(index + 1);
      this.completeNext(index + 1);
    }, 800);
  }

  private resetAndReplay() {
    this.tasks.set(this.tasks().map(t => ({ ...t, done: false })));
    this.completedCount.set(0);
    this.currentPhase.set('Planning');

    this.stepTimer = setTimeout(() => {
      this.currentPhase.set('In Progress');
      this.completeNext(0);
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.stepTimer) clearTimeout(this.stepTimer);
    this.cleanup?.();
  }
}

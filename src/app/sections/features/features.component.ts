import {
  Component,
  ElementRef,
  afterNextRender,
  inject,
  OnDestroy,
} from '@angular/core';
import { DeveloperCardComponent } from './developer-card.component';
import { ContentCardComponent } from './content-card.component';
import { SolverCardComponent } from './solver-card.component';
import { FadeUpDirective } from '../../core/directives/fade-up.directive';

@Component({
  selector: 'dp-features',
  imports: [DeveloperCardComponent, ContentCardComponent, SolverCardComponent, FadeUpDirective],
  templateUrl: './features.component.html',
})
export class FeaturesComponent implements OnDestroy {
  private readonly el = inject(ElementRef);
  private iframe: HTMLIFrameElement | null = null;

  constructor() {
    afterNextRender(() => {
      const container = this.el.nativeElement.querySelector('.video-container');
      if (!container) return;

      const videoId = 'GY0AbSBwP5w';
      const params = new URLSearchParams({
        autoplay: '1',
        mute: '1',
        loop: '1',
        playlist: videoId,
        controls: '0',
        showinfo: '0',
        rel: '0',
        modestbranding: '1',
        playsinline: '1',
        vq: 'hd1080',
      });

      this.iframe = document.createElement('iframe');
      this.iframe.src = `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
      this.iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      this.iframe.allowFullscreen = false;
      this.iframe.loading = 'lazy';
      this.iframe.title = 'Background video';
      this.iframe.className = 'video-iframe';

      container.appendChild(this.iframe);
    });
  }

  ngOnDestroy(): void {
    this.iframe?.remove();
  }
}

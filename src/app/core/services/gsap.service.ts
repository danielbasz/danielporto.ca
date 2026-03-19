import { Injectable, PLATFORM_ID, inject, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class GsapService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly zone = inject(NgZone);
  private gsapModule: typeof import('gsap') | null = null;
  private scrollTriggerRegistered = false;

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async loadGsap() {
    if (!this.isBrowser) return null;
    if (!this.gsapModule) {
      this.gsapModule = await import('gsap');
    }
    return this.gsapModule.gsap;
  }

  async loadScrollTrigger() {
    if (!this.isBrowser) return null;
    const gsap = await this.loadGsap();
    if (!gsap) return null;

    if (!this.scrollTriggerRegistered) {
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      this.scrollTriggerRegistered = true;
      return ScrollTrigger;
    }

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    return ScrollTrigger;
  }

  /**
   * Creates a GSAP context scoped to an element.
   * Runs outside Angular zone for performance.
   * Returns a cleanup function.
   */
  async createContext(
    element: HTMLElement,
    setupFn: (gsap: any, ctx: any) => void
  ): Promise<(() => void) | null> {
    const gsap = await this.loadGsap();
    if (!gsap) return null;

    let ctx: any;
    this.zone.runOutsideAngular(() => {
      ctx = gsap.context((self: any) => {
        setupFn(gsap, self);
      }, element);
    });

    return () => ctx?.revert();
  }
}

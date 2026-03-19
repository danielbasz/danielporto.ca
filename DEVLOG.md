# DEVLOG — danielporto.ca

The story of building this portfolio. Every decision, trade-off, and the AI-assisted development process documented.

---

## Phase 1 — Foundation

**Date:** March 19, 2026
**Goal:** Deployable skeleton — Angular 21 scaffold, design system, cinematic hero, floating navbar, Docker.

### The Brief

Rebuild danielporto.ca as a cinematic Angular app that speaks to two audiences:
- **Content/marketing hiring managers** — beautiful design, storytelling, visual polish
- **Technology hiring managers** — clean architecture, modern stack, AI-assisted dev process

The current site (Next.js 15, GitHub Pages) is functional but undersells the dual background: 2.5 years building enterprise Angular at CRA + broadcast content production at Globo TV.

### Tech Decisions

- **Angular 21** — daily driver at CRA. SSR with prerendering gives static HTML for SEO without a Node.js runtime in production.
- **Tailwind v4** — CSS-first `@theme` tokens replace config files. Simpler, more native.
- **GSAP** — industry standard for cinematic web animation. ScrollTrigger for scroll-driven effects.
- **Docker + nginx** — production-grade serving. No Node.js in the container.
- **Signals over NgRx** — portfolio state is simple. Signals are reactive without the ceremony.

### Design System — Organic Tech

Palette: moss `#2E4036`, clay `#CC5833`, cream `#F2F0E9`, charcoal `#1A1A1A`.
Typography: Plus Jakarta Sans (body), Outfit (display), Cormorant Garamond (serif accents), IBM Plex Mono (code/labels).

The aesthetic bridges natural warmth with technical precision — just like the portfolio owner.

### What Got Built

- Floating pill navbar with frosted glass scroll-morph and magnetic CTA hover
- Full-viewport hero with dark forest image, gradient overlays, staggered GSAP text entrance
- Subtle noise texture across entire page
- Lazy-loaded routes (Home + Devlog)
- `@defer` placeholder blocks for future sections
- Docker multi-stage build serving via nginx
- GitHub Actions CI (build check)

### Human Judgment Calls

- Hero copy "Technical Creative / with Vision." — Daniel's framing, not AI-generated marketing speak
- Organic Tech palette chosen to bridge the nature/tech duality of the brand
- Noise texture at 0.04 opacity — just enough to feel tactile, not enough to distract
- Navbar pill shape over full-width bar — feels premium, less corporate

---

*Next: Phase 2 — Interactive feature cards (Developer, Content Creator, Problem Solver)*

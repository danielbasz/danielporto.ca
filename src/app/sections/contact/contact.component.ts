import { Component } from '@angular/core';
import { FadeUpDirective } from '../../core/directives/fade-up.directive';

@Component({
  selector: 'dp-contact',
  imports: [FadeUpDirective],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  submitting = false;
  submitted = false;
  error = '';

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();
    this.submitting = true;
    this.error = '';

    const form = event.target as HTMLFormElement;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/mjgbbdeg', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        this.submitted = true;
      } else {
        this.error = 'Something went wrong. Please try again or email me directly.';
      }
    } catch {
      this.error = 'Network error. Please try again or email me directly.';
    } finally {
      this.submitting = false;
    }
  }

  reset(): void {
    this.submitted = false;
    this.error = '';
  }
}

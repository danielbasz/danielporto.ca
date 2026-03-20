import { Component } from '@angular/core';
import { DeveloperCardComponent } from './developer-card.component';
import { FadeUpDirective } from '../../core/directives/fade-up.directive';

@Component({
  selector: 'dp-features',
  imports: [DeveloperCardComponent, FadeUpDirective],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {}

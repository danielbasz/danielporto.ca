import { Component } from '@angular/core';
import { DeveloperCardComponent } from './developer-card.component';
import { ContentCardComponent } from './content-card.component';
import { SolverCardComponent } from './solver-card.component';
import { FadeUpDirective } from '../../core/directives/fade-up.directive';

@Component({
  selector: 'dp-features',
  imports: [DeveloperCardComponent, ContentCardComponent, SolverCardComponent, FadeUpDirective],
  templateUrl: './features.component.html',
})
export class FeaturesComponent {}

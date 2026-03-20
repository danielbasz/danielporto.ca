import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';
import { FeaturesComponent } from '../../sections/features/features.component';

@Component({
  selector: 'dp-home',
  imports: [HeroComponent, FeaturesComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}

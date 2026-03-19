import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';

@Component({
  selector: 'dp-home',
  imports: [HeroComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}

import { Component } from '@angular/core';
import { HeroComponent } from '../../sections/hero/hero.component';
import { FeaturesComponent } from '../../sections/features/features.component';
import { PhilosophyComponent } from '../../sections/philosophy/philosophy.component';
import { ProtocolComponent } from '../../sections/protocol/protocol.component';
import { ContactComponent } from '../../sections/contact/contact.component';

@Component({
  selector: 'dp-home',
  imports: [HeroComponent, FeaturesComponent, PhilosophyComponent, ProtocolComponent, ContactComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {}

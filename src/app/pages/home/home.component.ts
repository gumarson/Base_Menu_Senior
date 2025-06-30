import { Component } from '@angular/core';
import { EstacionamentoComponent } from '../estacionamento/estacionamento.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [EstacionamentoComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent{

}
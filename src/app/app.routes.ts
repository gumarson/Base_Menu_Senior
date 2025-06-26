import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EstacionamentoComponent } from './pages/estacionamento/estacionamento.component';

export const routes: Routes = [
  { path: '', component: EstacionamentoComponent }
];

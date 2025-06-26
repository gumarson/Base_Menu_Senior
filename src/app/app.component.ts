import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { RequestService } from '@services/request/request.service';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { LoadingComponent } from './components/loading/loading.component';
import { InvokeService } from '@services/invoke/invoke.services';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, MessagesModule, ToastModule, LoadingComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isLoading = true;

  title = "Título da página";

  constructor(translate: TranslateService, private requestService: RequestService) {
    translate.setDefaultLang('pt-BR');
    translate.use('pt-BR');
    window.addEventListener("message", (event: any) => {
      console.log(event.title)
      if (event?.data?.token && event?.data.token.access_token && event.data.token.token_type && event.data.token.username) {
        this.requestService.setProps(
          event.data.token.access_token,
          event.data.token.token_type,
          event.data.token.username,
          event.data.token.email,
          event.data.token.tenantName
        );
        setTimeout(()=>{
          this.isLoading = false;
        },2000);
      }
    });
  }
}

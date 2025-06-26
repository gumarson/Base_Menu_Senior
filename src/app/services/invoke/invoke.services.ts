import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';

interface ResponseModel<T> {
  outputData: T
}

@Injectable({providedIn: 'root'})
export class InvokeService<T>{
  private readonly invoke = 'https://platform.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/conector/actions/invoke';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  payload = {
    inputData:{
      port:'',
      server: environment.server,
      encryption:'0',
      password: 'senior',
      user: 'senior',
      service:'',
      module:'rubi',
    },
    id: 'f2200c3b-c7df-4040-9613-34f697b75889'
  }

  post(service: string, port: string, args: Record<string, string>): Observable<ResponseModel<T>> {
    this.payload.inputData = {
      ...this.payload.inputData,
      ... {
        service,
        port,
        ...args
      }
    };

    return this.http.post<ResponseModel<T>>(this.invoke, this.payload);
  }

}

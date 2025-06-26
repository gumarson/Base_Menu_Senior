import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestService } from '../services/request/request.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private requestService: RequestService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtém o token do RequestService
    const token = this.requestService.getAccessToken();

    // Clona a requisição e adiciona o token no cabeçalho
    if (token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `${token}`
        }
      });
      return next.handle(clonedRequest);
    }

    // Se não houver token, apenas prossegue com a requisição original
    return next.handle(req);
  }
}

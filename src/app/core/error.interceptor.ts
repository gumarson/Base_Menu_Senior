import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { MessageService } from 'primeng/api'; // Importando o MessageService do PrimeNG
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) { }

  private get messageService(): MessageService {
    return this.injector.get(MessageService); // Injetando o MessageService do PrimeNG
  }

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          this.forbiddenNotification();
        } else {
          if (error.status === 500) {
            /* eslint-disable */
            const g5Error = error?.error?.businessError as string;
            if (g5Error) {
              const fullErrorMessage = error?.error?.errorMessage.substring(
                error?.error?.errorMessage.indexOf('[ERRO]') + 6
              );
              const errorSplited = fullErrorMessage.split('#') as Array<string>;
              if (errorSplited.length > 1) {
                const title = errorSplited[0] as string;
                const message = errorSplited[1] as string;
                this.g5CustomizedError(title, message);
              }
            }

            this.badRequestNotification(error);
            /* eslint-enable */
          }
        }

        this.badRequestNotification(error);
        return throwError(error);
      })
    );
  }

  forbiddenNotification(): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Acesso Não Autorizado',
      detail: 'Tente logar novamente ou contacte o administrador do sistema.',
      life: 0 // Duração indefinida, similar ao nzDuration: 0 do ng-zorro
    });
  }

  badRequestNotification(error: HttpErrorResponse): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Falha ao se comunicar com o Servidor',
      detail: error?.error?.message, // Exibindo a mensagem de erro recebida
      life: 0
    });
  }

  g5CustomizedError(title: string, message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: 0
    });
  }
}

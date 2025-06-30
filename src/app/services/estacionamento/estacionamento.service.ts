import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { InvokeService } from '@services/invoke/invoke.services';

@Injectable({
  providedIn: 'root',
})
export class EstacionamentoService {
  private url =
    'https://platform-homologx.senior.com.br/t/senior.com.br/bridge/1.0/rest/platform/conector/actions/invoke';
  private server = 'http://ec2-54-86-30-4.compute-1.amazonaws.com:8080/';
  private id = 'b0d5b4d8-a857-4261-bb7e-efa6342296e1';

  constructor(private http: HttpClient) {}

  async buscarEstacionamento(): Promise<any> {
    const body = {
      id: this.id,
      configurationId: '1e85b152-6dac-43c4-ad66-7160d28fa976',
      inputData: {
        server: this.server,
        module: 'rubi',
        port: 'listarEstacionamentos',
        service: 'com.senior.g5.rh.fp.estacionamento',
        user: 'alexandre',
        rootObject: '',
        password: 'senior123',
        encryption: '0',
      },
    };

    try {
      const response = await firstValueFrom(this.http.post(this.url, body));
      return response;
    } catch (error) {
      console.error('Erro ao buscar dados do estacionamento:', error);
      throw error;
    }
  }

  async buscarVaga(): Promise<any> {
    const body = {
      id: this.id,
      configurationId: 'cf25feca-6483-47d0-b184-dcf3598aac88',
      inputData: {
        server: this.server,
        module: 'rubi',
        port: 'listarVagas',
        service: 'com.senior.g5.rh.fp.vaga',
        user: 'alexandre',
        rootObject: '',
        password: 'senior123',
        encryption: '0',
      },
    };

    try {
      const response = await firstValueFrom(this.http.post(this.url, body));
      return response;
    } catch (error) {
      console.error('Erro ao buscar dados do estacionamento:', error);
      throw error;
    }
  }
}

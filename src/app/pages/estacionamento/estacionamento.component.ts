import { Component, OnInit } from '@angular/core';
import { EstacionamentoService } from '@services/estacionamento/estacionamento.service';
// import cores from '@shared/mocks/cor-mock.json';

@Component({
  selector: 'app-estacionamento',
  templateUrl: './estacionamento.component.html',
  styleUrls: ['./estacionamento.component.scss'],
})
export class EstacionamentoComponent implements OnInit {
  dadosEstacionamento: any[] = [];
  vagasCarregadas: boolean = false;

  constructor(private estacionamentoService: EstacionamentoService) {}

  async ngOnInit(): Promise<void> {
    await this.carregarEstacionamento();
  }

  async carregarEstacionamento(): Promise<void> {
    try {
      const resultado = await this.estacionamentoService.buscarEstacionamento();
      this.dadosEstacionamento = resultado?.outputData?.dados || [];
      this.vagasCarregadas = true;
    } catch (erro) {
      console.error('Erro ao carregar estacionamento:', erro);
    }
  }

  redirectToBPM(): void {
    window.open(
      'https://platform-homologx.senior.com.br/tecnologia/platform/senior-x/#/XPlatform/1/item-task-center?category=frame&link=https:%2F%2Fplatform-homologx.senior.com.br%2Ftecnologia%2Fplatform%2Fworkflow%2F%23%2Fdashboard%2Ftasks%2Fpending&helpUrl=https:%2F%2Fdocumentacao.senior.com.br%2Fbpm%2F7.0.0%2F&r=0',
      '_blank'
    );
  }

  

  // getCorStatus(vaga: any): string {
  //   return vaga?.status === 'LIVRE'
  //     ? '#2e7d32'
  //     : this.normalizarCor(vaga?.corvei);
  // }

  // normalizarCor(cor: string | null | undefined): string {
  //   if (!cor) return '#f4f4f4';
  //   const nomeNormalizado = cor
  //     .normalize('NFD')
  //     .replace(/[\u0300-\u036f]/g, '')
  //     .toLowerCase()
  //     .trim();
  //   const corEmIngles = (cores as Record<string, string>)[nomeNormalizado] || nomeNormalizado;
  //   const colorCss = `rgba(${this.getRgbValues(corEmIngles)}, 0.4)`;
  //   if (CSS.supports('color', colorCss)) return colorCss;
  //   console.warn(`[Color] "${nomeNormalizado}" não reconhecida — fallback para cinza claro`);
  //   return '#f4f4f4';
  // }

  // getRgbValues(cor: string): string {
  //   const temp = document.createElement('div');
  //   temp.style.color = cor;
  //   document.body.appendChild(temp);
  //   const computedColor = getComputedStyle(temp).color;
  //   document.body.removeChild(temp);
  //   const match = computedColor.match(/\d+, \d+, \d+/);
  //   return match ? match[0] : '244, 244, 244'; // fallback cinza claro
  // }
}

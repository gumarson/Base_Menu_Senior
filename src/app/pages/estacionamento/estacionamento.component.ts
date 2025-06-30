// import { Component, OnInit } from '@angular/core';
// import { EstacionamentoService } from '@services/estacionamento/estacionamento.service';
// // import cores from '@shared/mocks/cor-mock.json';

// @Component({
//   selector: 'app-estacionamento',
//   templateUrl: './estacionamento.component.html',
//   styleUrls: ['./estacionamento.component.scss'],
// })
// export class EstacionamentoComponent implements OnInit {
//   dadosEstacionamento: any[] = [];
//   vagasCarregadas: boolean = false;

//   constructor(private estacionamentoService: EstacionamentoService) {}

//   async ngOnInit(): Promise<void> {
//     await this.carregarEstacionamento();
//   }

//   async carregarEstacionamento(): Promise<void> {
//     try {
//       const resultado = await this.estacionamentoService.buscarEstacionamento();
//       this.dadosEstacionamento = resultado?.outputData?.dados || [];
//       this.vagasCarregadas = true;
//     } catch (erro) {
//       console.error('Erro ao carregar estacionamento:', erro);
//     }
//   }

//   redirectToBPM(): void {
//     window.open(
//       'https://platform-homologx.senior.com.br/tecnologia/platform/senior-x/#/XPlatform/1/item-task-center?category=frame&link=https:%2F%2Fplatform-homologx.senior.com.br%2Ftecnologia%2Fplatform%2Fworkflow%2F%23%2Fdashboard%2Ftasks%2Fpending&helpUrl=https:%2F%2Fdocumentacao.senior.com.br%2Fbpm%2F7.0.0%2F&r=0',
//       '_blank'
//     );
//   }

  

//   // getCorStatus(vaga: any): string {
//   //   return vaga?.status === 'LIVRE'
//   //     ? '#2e7d32'
//   //     : this.normalizarCor(vaga?.corvei);
//   // }

//   // normalizarCor(cor: string | null | undefined): string {
//   //   if (!cor) return '#f4f4f4';
//   //   const nomeNormalizado = cor
//   //     .normalize('NFD')
//   //     .replace(/[\u0300-\u036f]/g, '')
//   //     .toLowerCase()
//   //     .trim();
//   //   const corEmIngles = (cores as Record<string, string>)[nomeNormalizado] || nomeNormalizado;
//   //   const colorCss = `rgba(${this.getRgbValues(corEmIngles)}, 0.4)`;
//   //   if (CSS.supports('color', colorCss)) return colorCss;
//   //   console.warn(`[Color] "${nomeNormalizado}" não reconhecida — fallback para cinza claro`);
//   //   return '#f4f4f4';
//   // }

//   // getRgbValues(cor: string): string {
//   //   const temp = document.createElement('div');
//   //   temp.style.color = cor;
//   //   document.body.appendChild(temp);
//   //   const computedColor = getComputedStyle(temp).color;
//   //   document.body.removeChild(temp);
//   //   const match = computedColor.match(/\d+, \d+, \d+/);
//   //   return match ? match[0] : '244, 244, 244'; // fallback cinza claro
//   // }
// }



import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { EstacionamentoService } from '@services/estacionamento/estacionamento.service';

@Component({
  selector: 'app-estacionamento',
  templateUrl: './estacionamento.component.html',
  imports: [CommonModule, FormsModule],
  standalone: true,
  styleUrls: ['./estacionamento.component.scss'],
})
export class EstacionamentoComponent implements OnInit {
  dadosEstacionamento: any[] = [];
  vagasCarregadas: any[] = [];
  estacionamentoSelecionadoId: string = ''; 
  carregandoVagas = false;
  temVagasLivres = false;

  constructor(private estacionamentoService: EstacionamentoService) {}

  async ngOnInit(): Promise<void> {
    await this.carregarEstacionamento();
  }

  async aoSelecionarEstacionamento(): Promise<void> {
    if (this.estacionamentoSelecionadoId) { 
      await this.carregarVagas();
    } else {
      this.vagasCarregadas = [];
      this.temVagasLivres = false;
    }
  }

  async carregarEstacionamento(): Promise<void> {
    try {
      const resultado = await this.estacionamentoService.buscarEstacionamento();
      this.dadosEstacionamento = resultado?.outputData?.lista || [];
      if (this.dadosEstacionamento.length > 0) {
        this.estacionamentoSelecionadoId = ''; 
      }
    } catch (erro) {
      console.error('Erro ao carregar estacionamento:', erro);
    }
  }

  async carregarVagas(): Promise<void> {
    this.carregandoVagas = true;
    this.vagasCarregadas = [];
    this.temVagasLivres = false;

    try {
      // 1. Encontrar os dados do estacionamento selecionado usando o ID.
      const estacionamentoInfo = this.dadosEstacionamento.find(
        (est) => est.codest === this.estacionamentoSelecionadoId 
      );

      if (!estacionamentoInfo) {
        console.error('Informações do estacionamento selecionado não encontradas.');
        return;
      }
      
      const totalVagasNoEstacionamento = parseInt(estacionamentoInfo.qtdvag, 10);

      // 2. Buscar a lista de TODAS as vagas ocupadas.
      const resultado = await this.estacionamentoService.buscarVaga();
      const todasAsVagasOcupadasDaApi = resultado?.outputData?.lista || [];

      // 3. Filtrar as vagas ocupadas APENAS para o estacionamento selecionado, USANDO O CODEST.
      const vagasOcupadasNesteEstacionamento = todasAsVagasOcupadasDaApi
        .filter((vaga: any) => vaga.codest === this.estacionamentoSelecionadoId); 

      // 4. FILTRAR DUPLICADOS
      const vagasOcupadasUnicas = vagasOcupadasNesteEstacionamento.filter((vaga: { plavei: any; }, index: any, self: any[]) =>
        index === self.findIndex((v) => v.plavei === vaga.plavei)
      );

      // 5. Mapear os dados para o template
      const vagasOcupadasParaExibir = vagasOcupadasUnicas.map((vaga: any) => ({
        ...vaga,
        // Garante que o nome do estacionamento exibido no card seja o correto, mesmo que a API de vagas retorne um nome errado.
        desest: estacionamentoInfo.desest, 
        status: 'OCUPADA'
      }));

      // 6. Calcular vagas livres
      const vagasLivresCount = Math.max(0, totalVagasNoEstacionamento - vagasOcupadasParaExibir.length);
      this.temVagasLivres = vagasLivresCount > 0;

      // 7. Criar objetos para as vagas livres
      const vagasLivresGeradas = [];
      for (let i = 0; i < vagasLivresCount; i++) {
        vagasLivresGeradas.push({
          status: 'LIVRE',
          modvei: '-',
          plavei: '-',
          desest: estacionamentoInfo.desest, 
        });
      }

      // 8. Combinar as listas
      this.vagasCarregadas = [...vagasOcupadasParaExibir, ...vagasLivresGeradas];

    } catch (erro) {
      console.error('Erro ao buscar vagas: ', erro);
    } finally {
      this.carregandoVagas = false;
    }
  }

  redirectToBPM(): void {
    window.open(
      'https://platform-homologx.senior.com.br/tecnologia/platform/senior-x/#/XPlatform/1/item-task-center?category=frame&link=https:%2F%2Fplatform-homologx.senior.com.br%2Ftecnologia%2Fplatform%2Fworkflow%2F%23%2Fdashboard%2Ftasks%2Fpending&helpUrl=https:%2F%2Fdocumentacao.senior.com.br%2Fbpm%2F7.0.0%2F&r=0',
      '_blank'
    );
  }
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



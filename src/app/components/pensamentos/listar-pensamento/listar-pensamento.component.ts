import { Component, OnInit } from '@angular/core';
import { Pensamento } from '../pensamento';
import { PensamentoService } from '../pensamento.service';
import { RouteReuseStrategy, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-listar-pensamento',
  templateUrl: './listar-pensamento.component.html',
  styleUrls: ['./listar-pensamento.component.css']
})
export class ListarPensamentoComponent implements OnInit {

  listaPensamentos: Array<Pensamento> = [];
  paginaAtual: number = 1;
  haMaisPensamentos: boolean = true
  filtro: string = ''
  favorito: boolean = false
  listaFavoritos: Pensamento[] = []
  titulo: string = "Meu Mural"

  constructor(
    private service: PensamentoService,
    private router: Router,
    private routeStrategy: RouteReuseStrategy,
    ) { }

  ngOnInit(): void {
      this.service.listar(this.paginaAtual, this.filtro, this.favorito).subscribe((listaPensamentos)=>{
        this.listaPensamentos = listaPensamentos
      })
  }

  carregarMaisPensamentos(): void {
    this.service.listar(++this.paginaAtual, this.filtro, this.favorito).subscribe(listaPensamentos => {
      this.listaPensamentos.push(...listaPensamentos);
      if(!listaPensamentos.length) {
        this.haMaisPensamentos = false;
      }
    })
  }

  pesquisarPensamentos(favorito?: boolean): void {
    if (favorito) {
      this.favorito = true
      this.titulo = "Meus Favoritos"
    }

    this.listarPensamentos()
  }

  listarPensamentos(): void {

    this.haMaisPensamentos = true;
    this.paginaAtual = 1;

    this.service.listar(this.paginaAtual, this.filtro, this.favorito).subscribe(listaPensamentos => {
    this.listaPensamentos = listaPensamentos
    this.listaFavoritos = listaPensamentos
    })
  }

  recarregarComponentes(): void {
    this.favorito = false;
    this.paginaAtual = 1;

    this.routeStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload'
    this.router.navigate([this.router.url])
  }
}

import { Injectable, signal } from '@angular/core';
import { Event, NavigationEnd, NavigationStart } from '@angular/router';

/**
 * Heurística 1 (visibilidad del estado del sistema): confirma las acciones que terminan en
 * otra pantalla (iniciar o cerrar sesión, crear, editar o eliminar). El aviso se ve en la
 * pantalla siguiente y desaparece en la navegación posterior.
 */
@Injectable({ providedIn: 'root' })
export class AvisosService {
  private readonly texto = signal<string | null>(null);
  private yaSeMostro = false;

  readonly aviso = this.texto.asReadonly();

  mostrar(texto: string): void {
    this.texto.set(texto);
    this.yaSeMostro = false;
  }

  cerrar(): void {
    this.texto.set(null);
  }

  /** La cabecera le pasa los eventos del router. */
  alNavegar(evento: Event): void {
    if (evento instanceof NavigationStart && this.yaSeMostro) {
      this.cerrar();
    } else if (evento instanceof NavigationEnd && this.texto()) {
      this.yaSeMostro = true;
    }
  }
}

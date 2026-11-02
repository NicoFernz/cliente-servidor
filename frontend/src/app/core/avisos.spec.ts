import { TestBed } from '@angular/core/testing';
import { NavigationEnd, NavigationStart } from '@angular/router';
import { AvisosService } from './avisos.service';

// Heurística 1: confirmar las acciones que terminan en otra pantalla.
describe('AvisosService', () => {
  let avisos: AvisosService;
  const inicio = (id: number) => new NavigationStart(id, '/destino');
  const fin = (id: number) => new NavigationEnd(id, '/destino', '/destino');

  beforeEach(() => (avisos = TestBed.inject(AvisosService)));

  it('muestra el aviso en la pantalla siguiente y lo quita en la navegación posterior', () => {
    avisos.mostrar('Publicación eliminada.');
    avisos.alNavegar(inicio(1));
    avisos.alNavegar(fin(1));
    expect(avisos.aviso()).toBe('Publicación eliminada.');

    avisos.alNavegar(inicio(2));
    expect(avisos.aviso()).toBeNull();
  });

  it('se puede cerrar a mano', () => {
    avisos.mostrar('Cerraste sesión.');

    avisos.cerrar();

    expect(avisos.aviso()).toBeNull();
  });
});

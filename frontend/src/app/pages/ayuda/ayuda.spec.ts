import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Ayuda } from './ayuda';

// Heurística 10: ayuda breve, orientada a las tareas del usuario.
describe('Ayuda', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Ayuda], providers: [provideRouter([])] }).compileComponents();
  });

  it('explica las tareas principales y las reglas del foro', async () => {
    const fixture = TestBed.createComponent(Ayuda);
    await fixture.whenStable();
    const titulos = [...(fixture.nativeElement as HTMLElement).querySelectorAll('h2')].map((h) => h.textContent?.trim());

    expect(titulos).toEqual([
      'Crear tu cuenta e iniciar sesión',
      'Publicar y comentar',
      'Reportar contenido',
      'Reglas de convivencia',
      'Para administradores',
    ]);
  });

  it('enlaza a las pantallas donde se hacen las tareas', async () => {
    const fixture = TestBed.createComponent(Ayuda);
    await fixture.whenStable();
    const enlaces = [...(fixture.nativeElement as HTMLElement).querySelectorAll('a')].map((a) => a.getAttribute('href'));

    expect(enlaces).toEqual(expect.arrayContaining(['/registro', '/login', '/publicaciones/nueva']));
  });
});

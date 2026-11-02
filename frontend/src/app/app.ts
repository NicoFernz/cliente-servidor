import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { AvisosService } from './core/avisos.service';
import { SesionService } from './core/sesion.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  protected readonly sesion = inject(SesionService);
  protected readonly avisos = inject(AvisosService);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed()).subscribe((evento) => this.avisos.alNavegar(evento));
  }

  protected cerrarSesion(): void {
    this.auth.cerrarSesion();
    this.avisos.mostrar('Cerraste sesión.');
    void this.router.navigateByUrl('/login');
  }
}

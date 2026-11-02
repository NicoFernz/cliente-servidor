import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Heurística 10 (ayuda y documentación): instrucciones breves, orientadas a las tareas del usuario (/ayuda). */
@Component({
  selector: 'app-ayuda',
  imports: [RouterLink],
  templateUrl: './ayuda.html',
  styleUrl: './ayuda.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Ayuda {}

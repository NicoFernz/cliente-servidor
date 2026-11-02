import { describe, expect, it } from 'vitest';
import { AppError } from '../../src/errors/AppError';

// Heurísticas 2 y 9: los mensajes llegan a la pantalla, así que tienen que leerse bien en español.
describe('AppError.noEncontrado', () => {
  it.each(['Publicación', 'Reporte', 'Categoría'])('para "%s" produce un mensaje sin errores de género', (recurso) => {
    const error = AppError.noEncontrado(recurso);

    expect(error.status).toBe(404);
    expect(error.message).toBe(`${recurso} inexistente`);
  });
});

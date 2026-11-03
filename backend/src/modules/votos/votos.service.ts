import type { ValorVoto } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { AppError } from '../../errors/AppError';

export interface ResumenVotos {
  positivos: number;
  negativos: number;
  miVoto: ValorVoto | null;
}

type ElementoConId = { id: number };

export async function agregarVotosPublicaciones<T extends ElementoConId>(
  publicaciones: T[],
  usuarioId?: number,
): Promise<Array<T & { votos: ResumenVotos }>> {
  const resumenes = await resumenesPublicaciones(
    publicaciones.map(({ id }) => id),
    usuarioId,
  );
  return publicaciones.map((publicacion) => ({
    ...publicacion,
    votos: resumenes.get(publicacion.id) ?? { positivos: 0, negativos: 0, miVoto: null },
  }));
}

export async function agregarVotosComentarios<T extends ElementoConId>(
  comentarios: T[],
  usuarioId?: number,
): Promise<Array<T & { votos: ResumenVotos }>> {
  const resumenes = await resumenesComentarios(
    comentarios.map(({ id }) => id),
    usuarioId,
  );
  return comentarios.map((comentario) => ({
    ...comentario,
    votos: resumenes.get(comentario.id) ?? { positivos: 0, negativos: 0, miVoto: null },
  }));
}

export async function votarPublicacion(publicacionId: number, usuarioId: number, valor: ValorVoto) {
  const publicacion = await prisma.publicacion.findUnique({ where: { id: publicacionId }, select: { autorId: true } });
  verificarPuedeVotar(publicacion, usuarioId, 'Publicación');

  await prisma.votoPublicacion.upsert({
    where: { usuarioId_publicacionId: { usuarioId, publicacionId } },
    create: { usuarioId, publicacionId, valor },
    update: { valor },
  });

  return (await resumenesPublicaciones([publicacionId], usuarioId)).get(publicacionId)!;
}

export async function quitarVotoPublicacion(publicacionId: number, usuarioId: number) {
  const publicacion = await prisma.publicacion.findUnique({ where: { id: publicacionId }, select: { autorId: true } });
  verificarPuedeVotar(publicacion, usuarioId, 'Publicación');

  await prisma.votoPublicacion.deleteMany({ where: { usuarioId, publicacionId } });

  return (await resumenesPublicaciones([publicacionId], usuarioId)).get(publicacionId)!;
}

export async function votarComentario(comentarioId: number, usuarioId: number, valor: ValorVoto) {
  const comentario = await prisma.comentario.findUnique({ where: { id: comentarioId }, select: { autorId: true } });
  verificarPuedeVotar(comentario, usuarioId, 'Comentario');

  await prisma.votoComentario.upsert({
    where: { usuarioId_comentarioId: { usuarioId, comentarioId } },
    create: { usuarioId, comentarioId, valor },
    update: { valor },
  });

  return (await resumenesComentarios([comentarioId], usuarioId)).get(comentarioId)!;
}

export async function quitarVotoComentario(comentarioId: number, usuarioId: number) {
  const comentario = await prisma.comentario.findUnique({ where: { id: comentarioId }, select: { autorId: true } });
  verificarPuedeVotar(comentario, usuarioId, 'Comentario');

  await prisma.votoComentario.deleteMany({ where: { usuarioId, comentarioId } });

  return (await resumenesComentarios([comentarioId], usuarioId)).get(comentarioId)!;
}

function verificarPuedeVotar(recurso: { autorId: number } | null, usuarioId: number, nombre: string): void {
  if (!recurso) {
    throw AppError.noEncontrado(nombre);
  }
  if (recurso.autorId === usuarioId) {
    throw AppError.prohibido('No podés votar tu propio contenido');
  }
}

async function resumenesPublicaciones(publicacionIds: number[], usuarioId?: number) {
  const resumenes = new Map<number, ResumenVotos>();
  if (publicacionIds.length === 0) return resumenes;

  const [conteos, propios] = await Promise.all([
    prisma.votoPublicacion.groupBy({
      by: ['publicacionId', 'valor'],
      where: { publicacionId: { in: publicacionIds } },
      _count: { _all: true },
    }),
    usuarioId
      ? prisma.votoPublicacion.findMany({
          where: { publicacionId: { in: publicacionIds }, usuarioId },
          select: { publicacionId: true, valor: true },
        })
      : Promise.resolve([]),
  ]);

  for (const id of publicacionIds) {
    resumenes.set(id, { positivos: 0, negativos: 0, miVoto: null });
  }
  for (const { publicacionId, valor, _count } of conteos) {
    const resumen = resumenes.get(publicacionId)!;
    if (valor === 'POSITIVO') resumen.positivos = _count._all;
    else resumen.negativos = _count._all;
  }
  for (const voto of propios) {
    resumenes.get(voto.publicacionId)!.miVoto = voto.valor;
  }
  return resumenes;
}

async function resumenesComentarios(comentarioIds: number[], usuarioId?: number) {
  const resumenes = new Map<number, ResumenVotos>();
  if (comentarioIds.length === 0) return resumenes;

  const [conteos, propios] = await Promise.all([
    prisma.votoComentario.groupBy({
      by: ['comentarioId', 'valor'],
      where: { comentarioId: { in: comentarioIds } },
      _count: { _all: true },
    }),
    usuarioId
      ? prisma.votoComentario.findMany({
          where: { comentarioId: { in: comentarioIds }, usuarioId },
          select: { comentarioId: true, valor: true },
        })
      : Promise.resolve([]),
  ]);

  for (const id of comentarioIds) {
    resumenes.set(id, { positivos: 0, negativos: 0, miVoto: null });
  }
  for (const { comentarioId, valor, _count } of conteos) {
    const resumen = resumenes.get(comentarioId)!;
    if (valor === 'POSITIVO') resumen.positivos = _count._all;
    else resumen.negativos = _count._all;
  }
  for (const voto of propios) {
    resumenes.get(voto.comentarioId)!.miVoto = voto.valor;
  }
  return resumenes;
}

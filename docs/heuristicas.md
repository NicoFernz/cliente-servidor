# Las diez heurísticas de usabilidad

> Referencia: las diez heurísticas de usabilidad de Jakob Nielsen, según el material de la cátedra, aplicadas al frontend del foro (v1).
> Criterio: se revisó la interfaz contra cada heurística y **solo se cambió lo que faltaba**. Las que ya se cumplían se documentan con su evidencia, sin agregar nada forzado.

## Resumen

| # | Heurística | Estado antes de revisar | Cambio |
|---|---|---|---|
| 1 | Visibilidad del estado del sistema | estados de carga y mensajes en cada pantalla, pero sin confirmación al iniciar o cerrar sesión ni al crear, editar o eliminar una publicación | avisos después de esas acciones |
| 2 | Relación con el mundo real | lenguaje del foro; un mensaje de la API decía "Publicación **no encontrado**" | "Publicación inexistente" |
| 3 | Control y libertad | ya se cumplía | — |
| 4 | Consistencia y estándares | lo mismo se llamaba "denuncia" para el estudiante y "reporte" para el admin | un solo término: **reportar / reporte** |
| 5 | Prevención de errores | ya se cumplía | — |
| 6 | Reconocimiento antes que recuerdo | sin categorías, el formulario mostraba un selector vacío sin explicación | aviso que explica qué falta |
| 7 | Flexibilidad y eficiencia | el filtro de categoría se perdía al volver de una publicación | el filtro queda en la URL |
| 8 | Diseño estético y minimalista | ya se cumplía | — |
| 9 | Reconocer, diagnosticar y recuperarse de errores | ya se cumplía, salvo los dos mensajes de las filas 2 y 6 | corregidos (ver 2 y 6) |
| 10 | Ayuda y documentación | solo el README, pensado para desarrolladores | página **Ayuda** dentro del foro |

Los cambios se hicieron con TDD: commit `test(heuristicas): … (RED)` con las pruebas que fallaban y commit `feat(heuristicas): … (GREEN)` con la corrección (evidencia en [testing.md](testing.md)).

---

## 1. Visibilidad del estado del sistema

**Definición.** El sistema mantiene informado al usuario sobre lo que pasa, con mensajes claros y en un tiempo razonable.

**Aplicación.**
- Mientras se procesa algo, el botón o la pantalla lo dice: "Ingresando…", "Creando cuenta…", "Guardando…", "Cargando publicaciones…", "Cargando comentarios…".
- Las acciones que no cambian de pantalla se confirman en el lugar: "¡Listo, Ana!" al registrarse, "Se creó la categoría…", "Gracias. Tu reporte quedó registrado…", el comentario nuevo aparece al final de la lista.
- **Agregado:** las acciones que terminan en otra pantalla muestran un aviso arriba de la página siguiente: "Hola, Ana. Iniciaste sesión.", "Cerraste sesión.", "Publicación creada.", "Cambios guardados.", "Publicación eliminada.". El aviso se puede cerrar y desaparece al navegar de nuevo.
- La cabecera muestra quién inició sesión y si es administrador.

**Evidencia.** `frontend/src/app/core/avisos.service.ts`, aviso global en `app.html`; pruebas `avisos.spec.ts`, `app.spec.ts`, `login.spec.ts`, `publicacion-form.spec.ts`, `publicacion-detalle.spec.ts`.

**Prueba de verificación.** Iniciar sesión con credenciales correctas → aparece "Hola, … Iniciaste sesión." y el nombre en la cabecera. Repetir con una contraseña incorrecta → "Correo o contraseña incorrectos".

## 2. Relación entre el sistema y el mundo real

**Definición.** Se usan palabras y conceptos familiares para el usuario, sin términos técnicos, y la información sigue un orden natural.

**Aplicación.**
- Términos del foro en español: Publicaciones, Comentarios, Categorías, Reportar, Nueva publicación, Cerrar sesión.
- Nunca se muestran códigos HTTP ni mensajes internos: cada error se traduce a una frase (por ejemplo "No se pudo conectar con el servidor" en lugar de un error de red; el servidor responde 500 sin detalles internos).
- Publicaciones de la más reciente a la más antigua; comentarios en orden de conversación (del más antiguo al más nuevo); fechas en formato `d/M/aaaa HH:mm`.
- **Corregido:** el mensaje de recurso inexistente decía "Publicación no encontrado". Ahora dice "Publicación inexistente" / "Reporte inexistente".

**Evidencia.** Textos de los componentes en `frontend/src/app/pages/`; `backend/src/errors/AppError.ts` y `errorHandler.ts`; prueba `backend/tests/unit/AppError.test.ts`.

**Prueba de verificación.** Pedirle a un estudiante que use el foro sin explicaciones y observar si encuentra cómo publicar, comentar y reportar.

## 3. Control y libertad del usuario

**Definición.** El usuario puede cancelar o deshacer y salir de una situación no deseada sin completar el proceso.

**Aplicación (ya existía).**
- "Cancelar" en el formulario de publicación (no guarda nada) y en el formulario de reporte.
- Confirmación antes de eliminar una publicación ("¿Eliminar la publicación?" con "Sí, eliminar" / "Cancelar"), también en el panel de reportes.
- "Cerrar sesión" siempre visible en la cabecera.
- "← Volver a las publicaciones" en el detalle; la marca "Foro universitario" lleva siempre al inicio.

**Evidencia.** `publicacion-form.html`, `publicacion-detalle.html`, `denuncia.html`, `admin-reportes.html`; pruebas "eliminar pide confirmación…" (`publicacion-detalle.spec.ts`), "el botón abre el formulario y Cancelar lo cierra" (`denuncia.spec.ts`), "Eliminar publicación pide confirmación…" (`admin-reportes.spec.ts`).

**Prueba de verificación.** Empezar una publicación y apretar "Cancelar" → no se guarda. Apretar "Eliminar" en una publicación propia → pide confirmación antes de borrar.

## 4. Consistencia y estándares

**Definición.** Mismas palabras, botones y comportamientos para lo mismo, y convenciones habituales de la web.

**Aplicación.**
- Formularios de registro, login, publicación, comentario, reporte y categorías con la misma estructura: etiqueta arriba, error en rojo debajo del campo, ayuda gris cuando no hay error, botón principal azul y acciones destructivas en rojo.
- Mismos estilos globales (`styles.css`: `.tarjeta`, `.campo`, `.boton`, `.aviso`) y el mismo patrón de estados (carga, vacío, error con "Reintentar") en todos los listados.
- API REST con los métodos estándar (GET, POST, PUT, PATCH, DELETE) y un formato de error único.
- **Corregido:** el estudiante "denunciaba" y el administrador veía "reportes". Ahora la interfaz dice siempre **reportar / reporte**: "Reportar publicación", "Motivo del reporte", "Enviar reporte", "Reportado por…".

**Evidencia.** `frontend/src/styles.css`; `denuncia.html`, `admin-reportes.html`; pruebas `denuncia.spec.ts` y `admin-reportes.spec.ts` (textos), `reportes.routes.test.ts` (mensaje del 409).

**Prueba de verificación.** Comparar los formularios de registro e inicio de sesión: mismas validaciones en pantalla, mismo lugar para los errores y mismo comportamiento del botón. Reportar una publicación y verla en el panel de admin con el mismo nombre.

## 5. Prevención de errores

**Definición.** Mejor evitar el error que avisar después.

**Aplicación (ya existía).**
- Validación antes de enviar en todos los formularios: campos obligatorios, formato de correo, largo mínimo y máximo (con `maxlength` en los campos).
- La misma validación en el backend (Zod), así nada inválido llega a la base aunque se saltee la pantalla.
- Correo y nombre de categoría únicos sin distinguir mayúsculas, garantizados por la base incluso con solicitudes simultáneas.
- Un reporte por persona y publicación; confirmación antes de eliminar.
- Los botones se deshabilitan mientras se envía, para no enviar dos veces.

**Evidencia.** Esquemas `*.schemas.ts`; restricciones `UNIQUE` en `schema.prisma`; pruebas de datos inválidos en `*.routes.test.ts`, `duplicados.concurrentes.test.ts`, escenarios de error en `features/`.

**Prueba de verificación.** Registrarse con un correo ya usado (con otras mayúsculas) → "El correo ya está registrado" y no se crea otra cuenta.

## 6. Reconocimiento antes que recuerdo

**Definición.** Las opciones importantes están a la vista; el usuario no tiene que recordar información de otra pantalla.

**Aplicación.**
- Las categorías se eligen de una lista, en el filtro del inicio y en el formulario.
- Cada publicación muestra su categoría, autor y fecha en el listado y en el detalle.
- Las acciones aparecen según el usuario: el autor ve "Editar" y "Eliminar", otros usuarios ven "Reportar publicación", el admin ve "Categorías" y "Reportes" en la cabecera; sin sesión, "Iniciá sesión para comentar" en lugar del formulario.
- **Agregado:** si todavía no hay categorías, el formulario de publicación lo explica ("Todavía no hay categorías… Un administrador tiene que crear al menos una") y deshabilita "Publicar", en lugar de mostrar un selector vacío.

**Limitación.** El material menciona "votar": los votos están fuera del alcance de la v1 (anotados como feature futura en [contribucion.md](contribucion.md#features-futuras-ya-anotadas)).

**Evidencia.** `inicio.html`, `publicacion-form.html`, `publicacion-detalle.html`, `app.html`; pruebas de `inicio.spec.ts`, `publicacion-detalle.spec.ts` (quién ve qué acción), `publicacion-form.spec.ts` (sin categorías).

**Prueba de verificación.** Entrar al foro y comprobar que se ven las categorías y las acciones disponibles sin tener que recordar nada de otra pantalla.

## 7. Flexibilidad y eficiencia de uso

**Definición.** Fácil para quien empieza y rápido para quien lo usa seguido.

**Aplicación.**
- Cada publicación tiene su propia dirección (`/publicaciones/:id`), que se puede guardar o compartir; después de iniciar sesión se vuelve a la página que se estaba viendo (`?volver=`).
- Filtro por categoría en el inicio.
- Comentar es directo desde el detalle, sin pasos intermedios.
- **Agregado:** el filtro queda en la URL (`/?categoria=2`): al entrar a una publicación y volver, el listado sigue filtrado, y el filtro se puede compartir.

**Limitación.** No hay búsqueda por texto ni atajos de teclado propios; con el volumen de la v1, el filtro por categoría alcanza. Los votos (mencionados en el material) no forman parte de la v1.

**Evidencia.** `app.routes.ts`, `inicio.ts`, `login.ts`; pruebas "el filtro queda en la URL y se recupera al volver" (`inicio.spec.ts`) y "vuelve a la página pedida" (`login.spec.ts`).

**Prueba de verificación.** Filtrar por una categoría, abrir una publicación y volver con el botón del navegador → el filtro sigue aplicado.

## 8. Diseño estético y minimalista

**Definición.** Cada elemento tiene una función; nada que distraiga.

**Aplicación (ya existía).**
- Formularios con los campos mínimos: registro (nombre, correo, contraseña), publicación (título, categoría, contenido), reporte (motivo).
- Listado con la información justa (título, categoría, autor, fecha); el contenido completo, en el detalle.
- Paleta reducida y sin librerías de UI; acción principal destacada (botón azul) y destructiva en rojo; diseño adaptable que funciona en celulares de 360 px.

**Evidencia.** `styles.css` y los `.html` de `frontend/src/app/pages/`.

**Prueba de verificación.** Recorrer las pantallas principales y comprobar que cada elemento tiene una función y que la acción principal se identifica sin buscarla.

## 9. Ayudar a reconocer, diagnosticar y recuperarse de errores

**Definición.** Los errores se explican en lenguaje simple, dicen cuál es el problema y cómo resolverlo, sin códigos técnicos.

**Aplicación.**
- Los errores de validación aparecen junto al campo que hay que corregir ("La contraseña debe tener al menos 8 caracteres") y se borran al editarlo.
- Errores del servidor traducidos: "El correo ya está registrado", "Correo o contraseña incorrectos", "Ya existe una categoría con ese nombre", "No se pudo conectar con el servidor. Intentá de nuevo en unos minutos.".
- Cuando falla una carga hay un botón "Reintentar" (que también recupera el filtro de categorías); si la sesión venció, el login lo explica ("Tu sesión expiró…") y después vuelve a la página anterior.
- Errores en el backend con formato único y sin detalles internos (`errorHandler.ts`).
- **Corregidos:** los mensajes de las heurísticas 2 ("Publicación inexistente") y 6 (sin categorías).

**Evidencia.** `backend/src/errors/`; componentes con `errorDe()` y avisos `role="alert"`; escenarios de error en `features/*.feature` (401, 403, 404, 409); pruebas de errores en cada `*.spec.ts`.

**Prueba de verificación.** Iniciar sesión con una contraseña incorrecta → "Correo o contraseña incorrectos", sin información interna del servidor; corregirla e ingresar.

## 10. Ayuda y documentación

**Definición.** Aunque el sistema se entienda solo, la ayuda tiene que ser fácil de encontrar y estar orientada a las tareas.

**Aplicación.**
- Ayudas breves en el lugar: "Registrate como estudiante para publicar y comentar", "Mínimo 8 caracteres", "Entre 10 y 5000 caracteres", "Lo revisará un administrador".
- **Agregado:** página **Ayuda** (`/ayuda`), enlazada desde la cabecera para todos: cómo crear la cuenta e iniciar sesión, cómo publicar y comentar, cómo reportar, reglas de convivencia y qué puede hacer un administrador.
- Para el equipo: [README](../README.md) (roles, permisos y funcionalidades), [instalación](instalacion-windows.md) y [endpoints](arquitectura.md#endpoints-implementados).

**Evidencia.** `frontend/src/app/pages/ayuda/`; pruebas `ayuda.spec.ts` y "el enlace de ayuda está siempre visible" (`app.spec.ts`).

**Prueba de verificación.** Darle el foro a alguien que no lo conoce, indicarle solo "Ayuda", y comprobar que puede registrarse, iniciar sesión, publicar y reportar.

---

## Limitaciones de la v1

- Los votos (mencionados en las heurísticas 6 y 7) están fuera del alcance de la v1.
- Las pruebas automáticas verifican que los textos, avisos y comportamientos existan; no reemplazan la evaluación con usuarios reales que proponen las pruebas de verificación de cada heurística.

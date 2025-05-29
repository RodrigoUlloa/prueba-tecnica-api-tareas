# API de Gestión de Tareas

## Instalación y Uso

1. **Clona el repositorio:**

   ```bash
   git clone <url-del-repositorio>
   cd api-gestion-tareas
   ```

   (También puedes abrirlo con tu explorador de archivos).

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Inicia la aplicación:**
   ```bash
   npm start
   ```

---

## Pruebas en el Navegador

Puedes inspeccionar visualmente el programa en tu navegador favorito.  
Funcionalidades disponibles:

- Agregar tareas.
- Eliminar tareas.
- Cambiar estado de `pending` a `done`.
- **Sincronización en tiempo real:**  
  Abre múltiples navegadores como clientes distintos y observa cómo se actualizan automáticamente.

---

## Pruebas con API Clients

### Ejemplos con `curl`

**Obtener todas las tareas:**

```bash
curl -X GET http://localhost:3000/tasks
```

**Crear una tarea:**

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"title": "My Task", "description": "This is a task description"}' \
  http://localhost:3000/tasks
```

**Eliminar una tarea (ejemplo con ID 4):**

> funciona con números como string o number

```bash
curl -v -X DELETE http://localhost:3000/tasks/4
```

**Actualizar estado (ejemplo con ID 1):**

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"status": "finished"}' \
  http://localhost:3000/tasks/1
```

---

### Nota para Postman

Asegúrate de incluir estos headers para evitar errores 400:

- `Content-Length`
- `Host`
- `Content-Type`

---

## Arquitectura y Consideraciones

- **Aplicación monolítica:** Diseño sencillo y funcional para el alcance del proyecto.
- **Organización del código:**
  - Endpoints separados.
  - Esquema de base de datos independiente.
  - Consultas a la base de datos modularizadas para mejor legibilidad.
- **Sincronización en tiempo real:**  
  Las eliminaciones se reflejan automáticamente en todos los clientes sin notificación explícita.
- **Nota sobre Socket.IO:**  
  Se implementó un wrapper básico para inyectar `io` en las rutas (solución temporal por limitaciones de tiempo).

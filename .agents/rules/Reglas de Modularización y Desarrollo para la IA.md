Estas reglas deben ser aplicadas estrictamente por la IA durante todo el desarrollo de la aplicación **nuevo_canal-denuncias**.

---

## 1. Base de Datos: PostgreSQL y Prisma ORM

- **Motor**: Se utilizará **PostgreSQL** de manera exclusiva. Toda definición de esquemas, migraciones y tipos debe estar adaptada a PostgreSQL (por ejemplo, el uso de tipos `JSONB` si es necesario para archivos o metadatos, y tipos nativos compatibles).
- **ORM**: Se utilizará **Prisma ORM**.
  - Todas las interacciones con la base de datos se realizarán a través de Prisma Client.
  - El esquema se ubicará en `backend/prisma/schema.prisma` con `provider = "postgresql"`.

---

## 2. Estructura de Directorios (Backend)

El backend se organizará en una arquitectura modular de 4 capas:

```
backend/
├── prisma/
│   └── schema.prisma         # Definición de modelos de PostgreSQL
└── src/
    ├── common/               # Middlewares, decoradores, utilidades, filtros de error globales
    ├── config/               # Variables de entorno y configuraciones de servicios
    └── modules/              # Módulos encapsulados por dominio
        ├── users/            # Ejemplo de módulo (Usuarios)
        │   ├── controllers/  # Capa 1: Transporte (HTTP/REST, validaciones Zod)
        │   ├── services/     # Capa 2: Lógica de Negocio (Leyes SLA, validaciones complejas)
        │   ├── repositories/ # Capa 3: Acceso a Datos (Consultas directas a Prisma)
        │   ├── dtos/         # Data Transfer Objects y esquemas Zod
        │   └── users.module.ts
        ├── companies/        # Módulo de Empresas / Tenants
        ├── reports/          # Módulo de Denuncias
        ├── messages/         # Módulo de Chat / Comunicaciones
        └── tasks/            # Módulo de Tareas
```

### Reglas de las Capas del Backend:

1. **Controladores**: Reciben peticiones HTTP, validan los parámetros de entrada con esquemas **Zod** y retornan respuestas estructuradas. No deben contener lógica de base de datos ni lógica de negocio.
2. **Servicios**: Contienen la lógica de negocio pura (por ejemplo, el cálculo de fechas SLA, desinfección de metadatos, control de estados). Pueden inyectar múltiples repositorios o interactuar con servicios externos (Nodemailer, ExifTool).
3. **Repositorios**: Son los únicos que interactúan con Prisma Client. Implementan métodos específicos de lectura/escritura y garantizan la seguridad de multi-tenancy.
4. **Seguridad Multi-inquilino (Multi-tenancy)**: Cada consulta que recupere datos de denuncias, chat, alegaciones o tareas en el repositorio **DEBE** requerir explícitamente un `tenantId` (o `empresaId`) para evitar fugas de datos entre empresas.

---

## 3. Estructura de Directorios (Frontend)

El frontend (React/Next.js/Vite) se estructurará siguiendo principios de diseño atómico y modular:

```
frontend/
└── src/
    ├── components/           # Componentes UI reutilizables y atómicos
    │   ├── ui/               # Botones, Inputs, Modales, Tablas, Badges (diseño premium)
    │   ├── forms/            # Componentes de formulario genéricos y reutilizables
    │   └── feedback/         # Alertas, Toasts, Skeletons de carga
    ├── hooks/                # Hooks personalizados reutilizables (auth, fetching, etc.)
    ├── layouts/              # Contenedores principales (Sidebar, DashboardLayout, PortalLayout)
    ├── pages/                # Componentes que representan rutas y gestionan el estado de la vista
    ├── services/             # Integración con la API (Axios / Fetch client)
    ├── store/                # Estado global (Zustand, Redux Toolkit o React Context)
    ├── styles/               # Variables CSS, configuraciones de Tailwind
    └── utils/                # Utilidades puras (formateadores de fecha, sanitización)
```

### Reglas del Frontend:

1. **Cero Duplicación de Código (DRY)**: Si un estilo, comportamiento o elemento visual (como un botón, tarjeta de denuncia o modal de alerta) se repite más de dos veces, se **DEBE** extraer a un componente reutilizable en `components/ui/`.
2. **Estilo Premium**: Todo componente visual debe seguir los principios de diseño modernos (glassmorphism en fondos de tarjetas, transiciones suaves en hovers y estados activos, paletas de colores HSL cohesivas y tipografía premium como Inter).
3. **Aislamiento de la API**: Las peticiones de red deben estar aisladas en la capa de `services/` y no mezcladas directamente en los componentes de UI.

---

## 4. Principios de Modificación y Prevención de Regresiones

- **Cambios Mínimos**: Limitar estrictamente las ediciones al alcance solicitado por el usuario.
- **Sin Refactorizaciones Silenciosas**: No reorganizar ni limpiar archivos globales que no estén involucrados en la tarea sin permiso del usuario.
- **Seguridad de Tipos**: Todo código nuevo debe ser estrictamente tipado. Evitar el uso de `any`.

---

## 5. Prohibición Absoluta de Ficheros Monolíticos

- **Límite de Líneas**: Se prohíbe terminantemente la creación o mantenimiento de archivos gigantescos ("ficheros monstruo"). Como regla general, ningún archivo de código (servicios, componentes, controladores o repositorios) debe superar las **250-300 líneas**.
- **Principio de Responsabilidad Única (SRP)**: Cada fichero debe resolver una única tarea o abstracción.
  - Si un servicio crece al agregar más funciones de negocio, se **DEBE** subdividir inmediatamente (ej. separar consultas `queries.ts` de mutaciones `mutations.ts`, o crear sub-servicios específicos).
  - Si un componente React/Next.js de la interfaz de usuario se vuelve denso (más de 200 líneas), se deben extraer obligatoriamente sus sub-secciones a componentes secundarios atómicos y reutilizables en carpetas locales o en `components/ui/`.
- **Prohibición de Lógica Mezclada**: Bajo ninguna circunstancia se permitirá mezclar lógica de base de datos directa (ORM/SQL) en los controladores o servicios, ni lógica de red directa (fetch/axios) en los componentes de UI. Todo debe estar desacoplado e importado.

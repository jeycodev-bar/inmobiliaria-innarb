# Innarb - Plataforma de Gestión Inmobiliaria

**Innarb** es una solución integral "Full Stack" para la gestión, publicación y visualización de bienes raíces. Diseñada como una Single Page Application (SPA) moderna, conecta a administradores, agentes inmobiliarios y clientes finales a través de una experiencia de usuario fluida y segura.

![Estado del Proyecto](https://img.shields.io/badge/Estado-Terminado-success)
![Licencia](https://img.shields.io/badge/Licencia-MIT-blue)

## Características Principales

* **Arquitectura Monorepo:** Gestión unificada de Backend y Frontend.
* **Gestión de Propiedades:** CRUD completo con carga de múltiples imágenes.
* **Roles de Usuario (RBAC):** Sistema seguro con roles de Administrador, Agente y Cliente.
* **Búsqueda Avanzada:** Filtrado dinámico por ciudad, tipo y precio.
* **UX Avanzada:**
    * Galería de imágenes tipo "Lightbox" con navegación por teclado.
    * Gestión de Favoritos con interfaz optimista.
    * Búsqueda flotante y animaciones de interfaz.
* **Seguridad:** Autenticación JWT, Hasheo de contraseñas y validación de datos.

## Stack Tecnológico

El proyecto utiliza el stack **PERN** modernizado con TypeScript:

* **Backend:** Node.js, Express, JWT, Bcrypt, Multer.
* **Frontend:** React (v18), Vite, Tailwind CSS, Context API.
* **Base de Datos:** PostgreSQL (Dockerizado).
* **Lenguaje:** TypeScript (Tipado estricto compartido).
* **Infraestructura:** Docker (para DB), pnpm (gestor de paquetes).

## Estructura del Proyecto

```bash
inmobiliaria-innarb/
├── apps/
│   ├── api/          # Backend (Express Server)
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   └── uploads/  # Almacenamiento local de imágenes
│   └── web/          # Frontend (React SPA)
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── services/
│       │   └── context/
├── package.json      # Configuración de Workspaces
└── README.md         # Documentación

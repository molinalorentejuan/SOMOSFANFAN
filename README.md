# FanFan System

Sistema de gestión de leads para FanFan.

## 🚀 Características

- **Formulario público** para recibir leads (membresías, grabaciones, proyectos, etc.)
- **Panel de administración** protegido para ver todos los leads
- **Base de datos PostgreSQL** para persistencia (con fallback a memoria en desarrollo)
- **Autenticación JWT** para acceso admin

## 📋 Requisitos

- Node.js 18+ (recomendado 20)
- npm 9+
- PostgreSQL (opcional para desarrollo local, requerido en producción)

## 🛠️ Instalación

### Backend (API)

```bash
cd api
npm install
```

### Frontend (Web)

```bash
cd web
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la carpeta `api/` basándote en `.env.example`:

```env
# PostgreSQL (Railways lo proporciona automáticamente)
DATABASE_URL=postgresql://...

# Credenciales admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_seguro

# JWT Secret
JWT_SECRET=tu_secret_jwt_seguro

# Puerto
PORT=8080
```

### Frontend

Crea un archivo `.env.local` en la carpeta `web/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 🏃 Desarrollo

### Backend

```bash
cd api
npm run dev        # http://localhost:4000
```

### Frontend

```bash
cd web
npm run dev        # http://localhost:3000
```

## 📦 Producción (Railways)

### Configurar PostgreSQL en Railways

1. Ve a tu proyecto en Railways
2. Agrega un servicio PostgreSQL
3. Railways automáticamente creará la variable `DATABASE_URL`
4. Las migraciones se ejecutan automáticamente al iniciar

### Variables de Entorno en Railways

Configura estas variables en Railways:

- `DATABASE_URL` (automático de PostgreSQL)
- `ADMIN_USERNAME` (ej: `admin`)
- `ADMIN_PASSWORD` (tu contraseña segura)
- `JWT_SECRET` (genera uno seguro)
- `PORT` (Railways lo configura automáticamente)

## 🔐 Acceso Admin

1. Ve a `/admin/login`
2. Usa las credenciales configuradas en `ADMIN_USERNAME` y `ADMIN_PASSWORD`
3. Accede a `/admin/leads` para ver todos los leads

## 📡 Endpoints API

### Públicos

- `POST /fanfan/leads` - Crear un nuevo lead (sin autenticación)

### Protegidos (requieren token admin)

- `GET /fanfan/leads` - Obtener todos los leads
- `POST /auth/login` - Login admin

## 🗄️ Base de Datos

La tabla `leads` se crea automáticamente con las siguientes columnas:

- `id` (VARCHAR) - ID único del lead
- `nombre` (VARCHAR) - Nombre del contacto
- `email` (VARCHAR) - Email del contacto
- `telefono` (VARCHAR) - Teléfono (opcional)
- `mensaje` (TEXT) - Mensaje/solicitud
- `tipo` (VARCHAR) - Tipo de solicitud
- `codigo` (VARCHAR) - Código de descuento (opcional)
- `descuento` (VARCHAR) - Descuento aplicado (opcional)
- `fecha` (TIMESTAMP) - Fecha de creación

## 📝 Notas

- Si no hay `DATABASE_URL` configurada, el sistema usa almacenamiento en memoria (solo desarrollo)
- Los leads se guardan automáticamente en PostgreSQL cuando está disponible
- El panel admin requiere autenticación con JWT

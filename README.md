# FanFan System

Sistema de gestión de leads para FanFan.

## 🚀 Características

- **Formulario público** para recibir leads (membresías, grabaciones, proyectos, etc.)
- **Panel de administración** protegido para ver todos los leads
- **Base de datos PostgreSQL** para persistencia (con fallback a memoria en desarrollo)
- **Autenticación JWT** para acceso admin
- **Next.js API Routes** - Todo integrado en una sola aplicación

## 📋 Requisitos

- Node.js 18+ (recomendado 20)
- npm 9+
- PostgreSQL (opcional para desarrollo local, requerido en producción)

## 🛠️ Instalación

```bash
cd web
npm install
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la carpeta `web/`:

```env
# PostgreSQL (Railways lo proporciona automáticamente)
DATABASE_URL=postgresql://...

# Credenciales admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_seguro

# JWT Secret
JWT_SECRET=tu_secret_jwt_seguro
```

## 🏃 Desarrollo

```bash
cd web
npm run dev        # http://localhost:3000
```

La API está disponible en:
- `POST /api/auth/login` - Login admin
- `POST /api/fanfan/leads` - Crear lead (público)
- `GET /api/fanfan/leads` - Obtener leads (requiere autenticación)

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

### Comandos de Build y Start en Railways

- **Build Command**: `cd web && npm install && npm run build`
- **Start Command**: `cd web && npm start`

## 🔐 Acceso Admin

1. Ve a `/admin/login`
2. Usa las credenciales configuradas en `ADMIN_USERNAME` y `ADMIN_PASSWORD`
3. Accede a `/admin/leads` para ver todos los leads

## 📡 Endpoints API

### POST /api/auth/login
Login de administrador.

**Body:**
```json
{
  "email": "admin",
  "password": "tu_password"
}
```

**Response:**
```json
{
  "token": "jwt_token",
  "user": {
    "username": "admin",
    "email": "admin",
    "role": "admin"
  }
}
```

### POST /api/fanfan/leads
Crear un nuevo lead (público, no requiere autenticación).

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "123456789",
  "mensaje": "Mensaje opcional",
  "tipo": "membresia",
  "codigo": "CODIGO123",
  "descuento": "10"
}
```

### GET /api/fanfan/leads
Obtener todos los leads (requiere autenticación admin).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "leads": [...],
  "total": 10
}
```

## 🏗️ Estructura del Proyecto

```
web/
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API Routes
│   │   │   ├── auth/
│   │   │   │   └── login/
│   │   │   │       └── route.ts
│   │   │   └── fanfan/
│   │   │       └── leads/
│   │   │           └── route.ts
│   │   ├── admin/            # Páginas admin
│   │   └── ...               # Otras páginas
│   └── lib/
│       ├── db.ts             # Conexión PostgreSQL
│       ├── auth.ts           # JWT y autenticación
│       ├── validators.ts     # Validación con Zod
│       └── api.ts            # Cliente API
└── package.json
```

## ✅ Ventajas de esta arquitectura

- ✅ **Un solo proyecto** - Todo en la carpeta `web`
- ✅ **Un solo package.json** - Sin problemas de múltiples lockfiles
- ✅ **Next.js maneja todo** - Sin servidor custom necesario
- ✅ **Despliegue simple** - Railway solo necesita ejecutar Next.js
- ✅ **API integrada** - Las rutas API están en el mismo proyecto

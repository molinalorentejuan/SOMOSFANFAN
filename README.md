# TailorHub Restaurantes – PRUEBA
ACLARACIONES: 
- Para cumplir con el diseño de Figma, la posición en el mapa de cada restaurante, se modifica en la pantalla de edición de restaurante.
- Al hacer clic en un marcador del mapa, la vista de la lista hace scroll automático hasta el restaurante correspondiente, que además se resalta aumentando su opacidad.

BONUS:
- Edición de restaurante añadido con posibles nuevos campos.
- Borrado de restaurante seguro restringido al propietario.
- Información de cuenta de usuario junto a los restaurantes que han creado.
- Documentación Swagger.

---

## Requisitos
- Node.js 18+ (recomendado 20)
- npm 9+
## Instalación rápida

Este repositorio contiene dos carpetas:

- **api/** → servidor Express (mock en memoria)
- **web/** → aplicación Next.js


## 1) API
```bash
cd api
npm install
npm run dev        # http://localhost:4000
```

### Tests API
```bash
cd api
npm run test           # Jest + Supertest
```

## 2) Web
```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

### Test FRONT: E2E TESTS
```bash
cd web
npx playwright install
npm run test:e2e
```

---

## Notas
- **Tests**: Lanzar tests con al menos un restaurante creado
- **Imágenes**: Se usa imágenes locales ubicadas en /web/public/MEDIA
- **Mapa**: `react-leaflet@4` + `leaflet@1.9`
- **Persistencia**: todo en memoria (se reinicia al parar la API).
- **Auth**: JWT; el front guarda token en localStorage mediante Zustand persist.


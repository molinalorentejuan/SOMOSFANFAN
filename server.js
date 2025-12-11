import express from "express";
import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV !== "production";

// Manejar promesas rechazadas no capturadas ANTES de cualquier otra cosa
process.on('unhandledRejection', (reason, promise) => {
  // Convertir reason a string seguro para evitar problemas con filter
  const reasonStr = reason instanceof Error ? reason.message : String(reason || 'Unknown error');
  console.error('⚠️ Unhandled Rejection:', reasonStr);
  // Log el stack trace si es un Error
  if (reason instanceof Error && reason.stack) {
    console.error('Stack:', reason.stack);
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
});

const nextApp = next({ dev, dir: path.join(__dirname, "web") });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const server = express();

  // Importar createApp después de que Next.js esté listo
  const { createApp } = require("./api/dist/app.js");

  if (typeof createApp !== "function") {
    console.error("❌ createApp no es una función. Valor:", createApp);
    process.exit(1);
  }

  server.use("/api", createApp());
  server.all("*", (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`✅ Ready on port ${port}`);
  });
}).catch((error) => {
  // Manejo seguro del error para evitar problemas con filter
  const errorMessage = error instanceof Error ? error.message : String(error || 'Unknown error');
  console.error('❌ Error iniciando Next.js:', errorMessage);
  if (error instanceof Error && error.stack) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
});

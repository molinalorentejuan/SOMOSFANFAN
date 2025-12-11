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

const nextApp = next({ dev, dir: path.join(__dirname, "web") });
const handle = nextApp.getRequestHandler();

// Manejar promesas rechazadas no capturadas ANTES de iniciar
process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection at:', promise);
  console.error('Reason:', reason);
  // No hacer exit(1) aquí para que Railway pueda manejar el error
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

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
  console.error('❌ Error iniciando Next.js:', error);
  process.exit(1);
});

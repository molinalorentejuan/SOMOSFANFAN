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

// Manejar errores ANTES de cualquier cosa
process.on('unhandledRejection', (reason, promise) => {
  const reasonStr = reason instanceof Error ? reason.message : String(reason || 'Unknown');
  console.error('⚠️ Unhandled Rejection:', reasonStr);
  if (reason instanceof Error && reason.stack) {
    console.error('Stack:', reason.stack);
  }
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error.message);
  if (error.stack) console.error('Stack:', error.stack);
  process.exit(1);
});

const webDir = path.resolve(__dirname, "web");
const nextApp = next({ dev, dir: webDir });
const handle = nextApp.getRequestHandler();

nextApp.prepare()
  .then(() => {
    const server = express();
    const { createApp } = require("./api/dist/app.js");
    
    if (typeof createApp !== "function") {
      console.error("❌ createApp no es función");
      process.exit(1);
    }

    server.use("/api", createApp());
    server.all("*", (req, res) => handle(req, res));
    server.listen(port, () => console.log(`✅ Ready on port ${port}`));
  })
  .catch((error) => {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) console.error('Stack:', error.stack);
    process.exit(1);
  });

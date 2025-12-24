import express from "express";
import router from "./routes/index.js";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());

export const imagesDir = process.env.VERCEL ? "/tmp/imagens" : path.join(process.cwd(), "src", "imagens");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

app.use("/imagens", express.static(imagesDir));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, '..', 'Tke_Front_end')));

router(app);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Tke_Front_end', 'index.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Tke_Front_end', 'index.html'));
});

export default app;

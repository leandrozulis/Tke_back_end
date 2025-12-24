import express from "express";
import router from "./routes";
import cors from "cors";
import path from "path";
import fs from "fs";

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

router(app);

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "API rodando" });
});

// import bcrypt from 'bcrypt';
// const password = 'Con@2025Tke'; // substitua
// const saltRounds = 12;

// bcrypt.hash(password, saltRounds, (err, hash) => {
//   if (err) throw err;
//   console.log('bcrypt hash:', hash);
// })

export default app;

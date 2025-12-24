import fs from "fs";
import path from "path";
import ProductImageService from "../../../services/ProductImage.service.js";
import { imagesDir } from "../../../app.js";

const productImageService = new ProductImageService();

export async function getImageFile(id: string) {
  const image = await productImageService.findById(id);

  if (!image) {
    throw new Error("Imagem não encontrada");
  }

  const relativePath = image.imagem;

  const filePath = path.join(imagesDir, path.basename(relativePath));

  if (!fs.existsSync(filePath)) {
    throw new Error("Arquivo físico não encontrado");
  }

  const file = fs.readFileSync(filePath);

  const ext = path.extname(filePath).toLowerCase();
  let mime = "application/octet-stream";

  if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
  if (ext === ".png") mime = "image/png";
  if (ext === ".webp") mime = "image/webp";

  return { file, mime };
}

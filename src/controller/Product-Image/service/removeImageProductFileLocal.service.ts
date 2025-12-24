import ProductImageService from "../../../services/ProductImage.service.js";
import fs from "fs";
import path from "path";
import { imagesDir } from "../../../app.js";

const productImageService = new ProductImageService();

export async function removeImageFile(id: string) {
  const image = await productImageService.findById(id);

  if (!image) {
    throw new Error("Imagem não encontrada");
  }

  const fileName = image.imagem;
  const filePath = path.join(imagesDir, fileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log("Arquivo deletado localmente:", filePath);
  } else {
    console.warn("Arquivo não encontrado localmente:", filePath);
  }

  await productImageService.delete(id);
}

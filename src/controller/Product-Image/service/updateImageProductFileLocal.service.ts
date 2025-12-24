import ProductImageService from "../../../services/ProductImage.service";
import { Request, Response } from "express";
import ProductService from "../../../services/Product.service";
import fs from "fs";
import path from "path";
import { imagesDir } from "../../../app";

const productImageService = new ProductImageService();
const productService = new ProductService();

export async function updateImageFile(id: string, req: Request, res: Response) {
  try {
    const oldImage = await productService.findById(id);

    console.log(oldImage);

    const oldImageExists = oldImage.ProductImage.length > 0;

    if (oldImageExists) {
      const oldFileName = oldImage.ProductImage[0].imagem;
      const oldFilePath = path.join(imagesDir, oldFileName);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    const file = req.file;
    const newName = `${Date.now()}-${file.originalname}`;
    const newFilePath = path.join(imagesDir, newName);
    fs.writeFileSync(newFilePath, file.buffer);

    const data = {
      imagem: newName,
    };

    const result = oldImageExists
      ? await productImageService.update(id, data)
      : await productImageService.create({ ...data, productId: id });

    return res.status(oldImageExists ? 200 : 201).json({
      message: oldImageExists ? "Imagem atualizada com sucesso" : "Imagem cadastrada com sucesso",
      image: result,
    });
  } catch (err) {
    console.error('Erro detalhado no processo de atualização:', err);
    return res.status(500).json({
      error: 'Erro ao atualizar imagem',
      details: err.message
    });
  }
}

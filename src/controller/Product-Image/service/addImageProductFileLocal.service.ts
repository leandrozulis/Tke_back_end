import { Request, Response } from "express";
import ProductService from "../../../services/Product.service";
import ProductImageService from "../../../services/ProductImage.service";
import fs from "fs";
import path from "path";
import { imagesDir } from "../../../app";

const productImageService = new ProductImageService();
const productService = new ProductService();

export async function addImageFile(id: string, req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Arquivo não enviado' });
    }

    const product = await productService.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(imagesDir, fileName);
    fs.writeFileSync(filePath, req.file.buffer);

    await productImageService.create({
      imagem: fileName,
      productId: id
    });

    console.log(fileName)

    return res.status(201).json({
      message: 'Imagem cadastrada com sucesso',
      fileName
    });

  } catch (err) {
    console.error('Erro detalhado no processo de upload:', err);
    return res.status(500).json({
      error: 'Erro ao enviar imagem',
      details: err.message
    });
  }
}

import { Request, Response } from "express";
import ProductImageService from "../../services/ProductImage.service";
import { addImageFile } from "./service/addImageProductFileLocal.service";
import { getImageFile } from "./service/getImageProductFileLocal.service";
import { removeImageFile } from "./service/removeImageProductFileLocal.service";
import { updateImageFile } from "./service/updateImageProductFileLocal.service";

const productImageService = new ProductImageService();

export default class ProductImageController {

  async getImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await getImageFile(id).then(({ file, mime }) => {
        res.setHeader("Content-Type", mime);
        res.send(file);
      });

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async getDataImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const image = await productImageService.findById(id);

      if (!image) {
        return res.status(404).json({ error: "Imagem não encontrada" });
      }

      res.status(200).json(image);

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async createImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "Imagem é obrigatória" });
      }

      await addImageFile(id, req, res);

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  async updateImage(req: Request, res: Response) {
    try {

      const { id } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: "Nova imagem é obrigatória" });
      }

      await updateImageFile(id, req, res);

    } catch (error: any) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao atualizar imagem",
        detalhes: error.message
      });
    }
  }

  async deleteImage(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await removeImageFile(id);

      return res.status(200).json({
        message: "Imagem deletada com sucesso"
      });

    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: "Erro ao deletar imagem",
        detalhes: String(error)
      });
    }
  }
}

import ProductImageService from "../../services/ProductImage.service.js";
import { addImageFile } from "./service/addImageProductFileLocal.service.js";
import { getImageFile } from "./service/getImageProductFileLocal.service.js";
import { removeImageFile } from "./service/removeImageProductFileLocal.service.js";
import { updateImageFile } from "./service/updateImageProductFileLocal.service.js";
const productImageService = new ProductImageService();
export default class ProductImageController {
    async getImage(req, res) {
        try {
            const { id } = req.params;
            await getImageFile(id).then(({ file, mime }) => {
                res.setHeader("Content-Type", mime);
                res.send(file);
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async getDataImage(req, res) {
        try {
            const { id } = req.params;
            const image = await productImageService.findById(id);
            if (!image) {
                return res.status(404).json({ error: "Imagem não encontrada" });
            }
            res.status(200).json(image);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async createImage(req, res) {
        try {
            const { id } = req.params;
            if (!req.file) {
                return res.status(400).json({ error: "Imagem é obrigatória" });
            }
            await addImageFile(id, req, res);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: error.message });
        }
    }
    async updateImage(req, res) {
        try {
            const { id } = req.params;
            if (!req.file) {
                return res.status(400).json({ error: "Nova imagem é obrigatória" });
            }
            await updateImageFile(id, req, res);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Erro ao atualizar imagem",
                detalhes: error.message
            });
        }
    }
    async deleteImage(req, res) {
        try {
            const { id } = req.params;
            await removeImageFile(id);
            return res.status(200).json({
                message: "Imagem deletada com sucesso"
            });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                erro: "Erro ao deletar imagem",
                detalhes: String(error)
            });
        }
    }
}

import { prisma } from "../database/prisma.js";
export default class ProductImageService {
    async findAll() {
        return await prisma.productImage.findMany();
    }
    async findById(id) {
        return await prisma.productImage.findUnique({
            where: { id }
        });
    }
    async create(data) {
        return prisma.productImage.create({
            data: {
                imagem: data.imagem,
                productId: data.productId
            }
        });
    }
    async update(productId, data) {
        return await prisma.productImage.update({
            where: { productId },
            data,
        });
    }
    async delete(id) {
        return await prisma.productImage.delete({
            where: { id },
        });
    }
}

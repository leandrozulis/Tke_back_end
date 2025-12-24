import { prisma } from "../database/prisma.js";

export default class ProductImageService {
  async findAll() {
    return await prisma.productImage.findMany();
  }

  async findById(id: string) {
    return await prisma.productImage.findUnique({
      where: { id }
    });
  }

  async create(data: { imagem: string; productId: string }) {

    return prisma.productImage.create({
      data: {
        imagem: data.imagem,
        productId: data.productId
      }
    });
  }

  async update(productId: string, data: Partial<{ imagem: string }>) {
    return await prisma.productImage.update({
      where: { productId },
      data,
    });
  }

  async delete(id: string) {
    return await prisma.productImage.delete({
      where: { id },
    });
  }
}

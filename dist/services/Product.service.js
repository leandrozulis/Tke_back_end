import { prisma } from "../database/prisma.js";
export default class ProductService {
    async findAll() {
        return await prisma.product.findMany();
    }
    async findByFilialAndCodigoGis(filial, codigoGis) {
        const product = await prisma.product.findFirst({
            where: {
                filial,
                codigoGis
            }
        });
        if (!product) {
            return null;
        }
        return product;
    }
    async findUnique(filial, referencia) {
        const product = await prisma.product.findFirst({
            where: {
                filial,
                OR: [
                    { codigoGis: referencia },
                    { numeroMaterial: referencia },
                    { descricao: referencia },
                    { posicaoDeposito: referencia }
                ].filter(Boolean)
            },
            include: {
                ProductImage: true
            }
        });
        return product;
    }
    async findById(id) {
        const product = await prisma.product.findFirst({
            where: {
                id
            },
            include: {
                ProductImage: true
            }
        });
        return product;
    }
    async create(data) {
        return await prisma.product.create({
            data,
        });
    }
    async update(id, data) {
        return await prisma.product.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        const product = await prisma.product.delete({
            where: {
                id
            },
        });
        return product;
    }
    async autocomplete(filial, referencia) {
        // Se a referência for muito curta, não faz a busca
        if (!referencia || referencia.length < 2) {
            return [];
        }
        return prisma.$queryRaw `
      SELECT 
        "id",
        "codigoGis",
        "numeroMaterial",
        "descricao",
        "deposito",
        "posicaoDeposito",
        "hierarquiaProduto",
        "createdAt"
      FROM "Product"
      WHERE 
        "filial" = ${filial} AND
        (
          LOWER("codigoGis") LIKE LOWER(${referencia + '%'}) OR
          LOWER("numeroMaterial") LIKE LOWER(${referencia + '%'}) OR
          LOWER("descricao") LIKE LOWER(${referencia + '%'}) OR
          LOWER("deposito") LIKE LOWER(${referencia + '%'}) OR
          LOWER("posicaoDeposito") LIKE LOWER(${referencia + '%'}) OR
          LOWER("hierarquiaProduto") LIKE LOWER(${referencia + '%'})
        )
      ORDER BY 
        CASE
          WHEN LOWER("codigoGis") = LOWER(${referencia}) THEN 1
          WHEN LOWER("numeroMaterial") = LOWER(${referencia}) THEN 2
          WHEN LOWER("descricao") = LOWER(${referencia}) THEN 3
          ELSE 4
        END,
        "createdAt" DESC
      LIMIT 10
    `;
    }
}

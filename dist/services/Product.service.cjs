"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/services/Product.service.js
var Product_service_exports = {};
__export(Product_service_exports, {
  default: () => ProductService
});
module.exports = __toCommonJS(Product_service_exports);

// dist/database/prisma.js
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// dist/services/Product.service.js
var ProductService = class {
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
      data
    });
  }
  async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    const product = await prisma.product.delete({
      where: {
        id
      }
    });
    return product;
  }
  async autocomplete(filial, referencia) {
    if (!referencia || referencia.length < 2) {
      return [];
    }
    return prisma.$queryRaw`
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
          LOWER("codigoGis") LIKE LOWER(${referencia + "%"}) OR
          LOWER("numeroMaterial") LIKE LOWER(${referencia + "%"}) OR
          LOWER("descricao") LIKE LOWER(${referencia + "%"}) OR
          LOWER("deposito") LIKE LOWER(${referencia + "%"}) OR
          LOWER("posicaoDeposito") LIKE LOWER(${referencia + "%"}) OR
          LOWER("hierarquiaProduto") LIKE LOWER(${referencia + "%"})
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
};

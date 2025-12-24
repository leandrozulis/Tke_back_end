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

// dist/services/ProductImage.service.js
var ProductImage_service_exports = {};
__export(ProductImage_service_exports, {
  default: () => ProductImageService
});
module.exports = __toCommonJS(ProductImage_service_exports);

// dist/database/prisma.js
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// dist/services/ProductImage.service.js
var ProductImageService = class {
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
      data
    });
  }
  async delete(id) {
    return await prisma.productImage.delete({
      where: { id }
    });
  }
};

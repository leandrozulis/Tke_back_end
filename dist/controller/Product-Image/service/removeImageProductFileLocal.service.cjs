"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// dist/controller/Product-Image/service/removeImageProductFileLocal.service.js
var removeImageProductFileLocal_service_exports = {};
__export(removeImageProductFileLocal_service_exports, {
  removeImageFile: () => removeImageFile
});
module.exports = __toCommonJS(removeImageProductFileLocal_service_exports);

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

// dist/controller/Product-Image/service/removeImageProductFileLocal.service.js
var import_fs5 = __toESM(require("fs"), 1);
var import_path6 = __toESM(require("path"), 1);

// dist/app.js
var import_express4 = __toESM(require("express"), 1);

// dist/routes/userRouter.js
var import_express = __toESM(require("express"), 1);

// dist/controller/Users/service/authenticate.service.js
var import_bcrypt = __toESM(require("bcrypt"), 1);

// dist/services/User.service.js
var UserService = class {
  async findByUsername(username) {
    return await prisma.user.findUnique({
      where: {
        username
      }
    });
  }
};

// dist/controller/Users/service/authenticate.service.js
var userAuthService = new UserService();
async function authenticateUser(user, password) {
  const findUser = await userAuthService.findByUsername(user);
  const doesPasswordMatch = await import_bcrypt.default.compare(password, findUser.password);
  if (!doesPasswordMatch) {
    throw new Error("Usu\xE1rio incorreto.");
  }
  return {
    id: findUser.id,
    username: findUser.username,
    role: findUser.role
  };
}

// dist/utils/jwt.js
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = String(process.env.JWT_SECRET);
var EXPIRES_IN = "7d";
function generateToken(payload) {
  return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
}
function verifyToken(token) {
  return import_jsonwebtoken.default.verify(token, JWT_SECRET);
}

// dist/controller/Users/users.controller.js
var UserController = class {
  async login(req, res) {
    try {
      const { user, password } = req.body;
      if (!user || !password) {
        return res.status(400).json({ error: "Missing credentials." });
      }
      const auth = await authenticateUser(user, password);
      const token = generateToken({
        id: auth.id,
        role: auth.role,
        username: auth.username
      });
      res.status(200).json({
        message: "User authenticated successfully.",
        role: auth.role,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

// dist/middleware/auth.js
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "Token missing." });
    return;
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token." });
    return;
  }
}

// dist/routes/userRouter.js
var router = import_express.default.Router();
var userController = new UserController();
router.post("/api/login", (req, res) => {
  userController.login(req, res);
});
router.get("/api/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    username: req.user.username,
    role: req.user.role
  });
});
var userRouter_default = router;

// dist/routes/productRouter.js
var import_express2 = __toESM(require("express"), 1);

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

// dist/services/Cache.service.js
var import_ioredis = require("ioredis");
var CacheService = class {
  constructor() {
    this.redis = new import_ioredis.Redis(process.env.REDIS_URL || "redis://localhost:6379");
  }
  async get(key) {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }
  async set(key, value, ttl = 60 * 5) {
    await this.redis.set(key, JSON.stringify(value), "EX", ttl);
  }
  async invalidate(prefix) {
    const keys = await this.redis.keys(`${prefix}:*`);
    if (keys.length > 0) {
      await this.redis.del(keys);
    }
  }
};
var Cache_service_default = new CacheService();

// dist/controller/Product/Product.controller.js
var xlsx = __toESM(require("xlsx"), 1);
var productService = new ProductService();
var productImageService = new ProductImageService();
var ProductController = class {
  async findById(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erro: "Par\xE2metro 'id' \xE9 obrigat\xF3rio para busca por ID" });
      }
      const product = await productService.findById(id);
      if (!product) {
        return res.status(404).json({ erro: "Produto n\xE3o encontrado" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }
  async findProduct(req, res) {
    try {
      const products = await productService.findAll();
      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  }
  async findUniqueProduct(req, res) {
    try {
      const { filial, referencia } = req.query;
      if (!referencia) {
        return res.status(400).json({ erro: "Valores aceitos de refer\xEAncia: codigoGis, numeroMaterial, descricao, deposito, posicaoDeposito" });
      }
      const product = await productService.findUnique(filial, referencia);
      if (!product) {
        return res.status(404).json({ erro: "Produto n\xE3o encontrado" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar produto" });
    }
  }
  async createProduct(req, res) {
    try {
      const { filial, codigoGis, numeroMaterial, descricao, deposito, posicaoDeposito, hierarquiaProduto } = req.body;
      if (!filial || !codigoGis || !numeroMaterial || !descricao || !deposito || !posicaoDeposito || !hierarquiaProduto) {
        return res.status(400).json({
          error: "Campos obrigat\xF3rios n\xE3o informados."
        });
      }
      const findProduct = await productService.findByFilialAndCodigoGis(filial, codigoGis);
      if (findProduct) {
        return res.status(200).json({
          message: "Produto j\xE1 cadastrado para essa filial"
        });
      }
      const newProduct = await productService.create({
        filial,
        codigoGis,
        numeroMaterial,
        descricao,
        deposito,
        posicaoDeposito,
        hierarquiaProduto
      });
      return res.status(201).json({
        message: "Produto cadastrado com sucesso.",
        product: newProduct
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro interno ao cadastrar produto."
      });
    }
  }
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const { filial, codigoGis, numeroMaterial, descricao, deposito, posicaoDeposito, hierarquiaProduto } = req.body;
      const updatePayload = {
        filial,
        codigoGis,
        numeroMaterial,
        descricao,
        deposito,
        posicaoDeposito,
        hierarquiaProduto
      };
      const finalPayload = Object.fromEntries(Object.entries(updatePayload).filter(([_, value]) => value !== ""));
      if (Object.keys(finalPayload).length === 0) {
        return res.status(200).json({
          message: "Nenhum dado v\xE1lido para atualiza\xE7\xE3o fornecido."
        });
      }
      await productService.update(id, finalPayload);
      return res.status(200).json({
        message: "Produto atualizado com sucesso"
      });
    } catch (error) {
      if (error.meta.target) {
        return res.status(400).json({
          error: `Erro ao atualizar produto, ${error.meta.target} j\xE1 cadastrado no sistema`
        });
      }
      return res.status(404).json({ erro: "Produto n\xE3o encontrado" });
    }
  }
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const { idImg } = req.body;
      if (idImg) {
        try {
          const image = await productImageService.findById(idImg);
          if (image) {
            await removeImageFile(idImg);
          }
        } catch (error) {
          console.error("Erro ao deletar imagem associada:", error);
        }
      }
      await productService.delete(id);
      return res.status(200).json({ message: "Produto deletado com sucesso" });
    } catch (error) {
      return res.status(404).json({ erro: "Produto n\xE3o encontrado." });
    }
  }
  async autocompleteProduct(req, res) {
    try {
      const { filial, referencia } = req.query;
      if (!referencia || referencia.length < 2) {
        return res.status(200).json([]);
      }
      const cacheKey = `autocomplete:${filial}:${referencia}`;
      const cachedResult = await Cache_service_default.get(cacheKey);
      if (cachedResult) {
        return res.status(200).json(cachedResult);
      }
      const products = await productService.autocomplete(filial, referencia);
      await Cache_service_default.set(cacheKey, products, 300);
      return res.status(200).json(products);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao buscar produtos para autocomplete"
      });
    }
  }
  async uploadExcel(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Nenhum arquivo enviado" });
      }
      const normalizarChave = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "_").replace(/[^\w]/g, "").toLowerCase();
      };
      const normalizarObjeto = (obj) => {
        const novo = {};
        for (const chave in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, chave)) {
            novo[normalizarChave(chave)] = obj[chave];
          }
        }
        return novo;
      };
      const workbook = xlsx.read(req.file.buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);
      const dadosNormalizados = data.map(normalizarObjeto);
      let importados = 0;
      for (const item of dadosNormalizados) {
        await productService.create({
          filial: String(item.filial),
          codigoGis: String(item.codigo_gis),
          numeroMaterial: String(item.numero_do_material),
          descricao: String(item.descricao),
          deposito: String(item.deposito),
          posicaoDeposito: String(item.posicao_deposito),
          hierarquiaProduto: String(item.hierarquia_do_produto)
        });
        importados++;
      }
      return res.json({
        sucesso: true,
        total: importados
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        sucesso: false,
        erro: "Erro ao importar Excel"
      });
    }
  }
  async exportExcel(req, res) {
    try {
      const produtos = await productService.findAll();
      if (!produtos || produtos.length === 0) {
        return res.status(404).json({ error: "Nenhum dado para exportar" });
      }
      const dadosFormatados = produtos.map((p) => ({
        Filial: p.filial,
        "C\xF3digo GIS": p.codigoGis,
        "N\xFAmero do Material": p.numeroMaterial,
        Descri\u00E7\u00E3o: p.descricao,
        Dep\u00F3sito: p.deposito,
        "Posi\xE7\xE3o Dep\xF3sito": p.posicaoDeposito,
        "Hierarquia do Produto": p.hierarquiaProduto
      }));
      const worksheet = xlsx.utils.json_to_sheet(dadosFormatados);
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Produtos");
      const buffer = xlsx.write(workbook, {
        type: "buffer",
        bookType: "xlsx"
      });
      res.setHeader("Content-Disposition", "attachment; filename=produtos.xlsx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      return res.send(buffer);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: "Erro ao exportar Excel"
      });
    }
  }
};

// dist/middleware/role.js
function requireRole(role) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || user.role !== role) {
      res.status(403).json({ error: "Permission denied." });
      return;
    }
    next();
  };
}

// dist/routes/productRouter.js
var import_multer = __toESM(require("multer"), 1);
var router2 = import_express2.default.Router();
var upload = (0, import_multer.default)({ storage: import_multer.default.memoryStorage() });
var productController = new ProductController();
router2.post("/api/product/create", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.createProduct(req, res);
});
router2.post("/api/product/upload", authMiddleware, upload.single("arquivo"), requireRole("ADMIN"), async (req, res) => {
  productController.uploadExcel(req, res);
});
router2.get("/api/product/find/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.findById(req, res);
});
router2.get("/api/product/find", authMiddleware, (req, res) => {
  productController.findUniqueProduct(req, res);
});
router2.get("/api/product/autocomplete", authMiddleware, (req, res) => {
  productController.autocompleteProduct(req, res);
});
router2.get("/api/product/allProducts", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.findProduct(req, res);
});
router2.put("/api/product/update/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.updateProduct(req, res);
});
router2.get("/api/product/export", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.exportExcel(req, res);
});
router2.delete("/api/product/remove/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productController.deleteProduct(req, res);
});
var productRouter_default = router2;

// dist/routes/productImageRouter.js
var import_express3 = __toESM(require("express"), 1);
var import_multer2 = __toESM(require("multer"), 1);

// dist/controller/Product-Image/service/addImageProductFileLocal.service.js
var import_fs = __toESM(require("fs"), 1);
var import_path = __toESM(require("path"), 1);
var productImageService2 = new ProductImageService();
var productService2 = new ProductService();
async function addImageFile(id, req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo n\xE3o enviado" });
    }
    const product = await productService2.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Produto n\xE3o encontrado" });
    }
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = import_path.default.join(imagesDir, fileName);
    import_fs.default.writeFileSync(filePath, req.file.buffer);
    await productImageService2.create({
      imagem: fileName,
      productId: id
    });
    console.log(fileName);
    return res.status(201).json({
      message: "Imagem cadastrada com sucesso",
      fileName
    });
  } catch (err) {
    console.error("Erro detalhado no processo de upload:", err);
    return res.status(500).json({
      error: "Erro ao enviar imagem",
      details: err.message
    });
  }
}

// dist/controller/Product-Image/service/getImageProductFileLocal.service.js
var import_fs2 = __toESM(require("fs"), 1);
var import_path2 = __toESM(require("path"), 1);
var productImageService3 = new ProductImageService();
async function getImageFile(id) {
  const image = await productImageService3.findById(id);
  if (!image) {
    throw new Error("Imagem n\xE3o encontrada");
  }
  const relativePath = image.imagem;
  const filePath = import_path2.default.join(imagesDir, import_path2.default.basename(relativePath));
  if (!import_fs2.default.existsSync(filePath)) {
    throw new Error("Arquivo f\xEDsico n\xE3o encontrado");
  }
  const file = import_fs2.default.readFileSync(filePath);
  const ext = import_path2.default.extname(filePath).toLowerCase();
  let mime = "application/octet-stream";
  if (ext === ".jpg" || ext === ".jpeg")
    mime = "image/jpeg";
  if (ext === ".png")
    mime = "image/png";
  if (ext === ".webp")
    mime = "image/webp";
  return { file, mime };
}

// dist/controller/Product-Image/service/updateImageProductFileLocal.service.js
var import_fs3 = __toESM(require("fs"), 1);
var import_path3 = __toESM(require("path"), 1);
var productImageService4 = new ProductImageService();
var productService3 = new ProductService();
async function updateImageFile(id, req, res) {
  try {
    const oldImage = await productService3.findById(id);
    const oldImageExists = oldImage.ProductImage.length > 0;
    if (oldImageExists) {
      const oldFileName = oldImage.ProductImage[0].imagem;
      const oldFilePath = import_path3.default.join(imagesDir, oldFileName);
      if (import_fs3.default.existsSync(oldFilePath)) {
        import_fs3.default.unlinkSync(oldFilePath);
      }
    }
    const file = req.file;
    const newName = `${Date.now()}-${file.originalname}`;
    const newFilePath = import_path3.default.join(imagesDir, newName);
    import_fs3.default.writeFileSync(newFilePath, file.buffer);
    const data = {
      imagem: newName
    };
    const result = oldImageExists ? await productImageService4.update(id, data) : await productImageService4.create({ ...data, productId: id });
    return res.status(oldImageExists ? 200 : 201).json({
      message: oldImageExists ? "Imagem atualizada com sucesso" : "Imagem cadastrada com sucesso",
      image: result
    });
  } catch (err) {
    console.error("Erro detalhado no processo de atualiza\xE7\xE3o:", err);
    return res.status(500).json({
      error: "Erro ao atualizar imagem",
      details: err.message
    });
  }
}

// dist/controller/Product-Image/ProductImage.controller.js
var productImageService5 = new ProductImageService();
var ProductImageController = class {
  async getImage(req, res) {
    try {
      const { id } = req.params;
      await getImageFile(id).then(({ file, mime }) => {
        res.setHeader("Content-Type", mime);
        res.send(file);
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
  async getDataImage(req, res) {
    try {
      const { id } = req.params;
      const image = await productImageService5.findById(id);
      if (!image) {
        return res.status(404).json({ error: "Imagem n\xE3o encontrada" });
      }
      res.status(200).json(image);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
  async createImage(req, res) {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: "Imagem \xE9 obrigat\xF3ria" });
      }
      await addImageFile(id, req, res);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }
  async updateImage(req, res) {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: "Nova imagem \xE9 obrigat\xF3ria" });
      }
      await updateImageFile(id, req, res);
    } catch (error) {
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
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: "Erro ao deletar imagem",
        detalhes: String(error)
      });
    }
  }
};

// dist/routes/productImageRouter.js
var router3 = import_express3.default.Router();
var upload2 = (0, import_multer2.default)();
var productImageController = new ProductImageController();
router3.post("/api/create/image/:id", upload2.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.createImage(req, res);
});
router3.get("/api/find/image/:id", authMiddleware, (req, res) => {
  productImageController.getImage(req, res);
});
router3.get("/api/img/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.getDataImage(req, res);
});
router3.put("/api/update/image/:id", upload2.single("buffer"), authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.updateImage(req, res);
});
router3.delete("/api/remove/image/:id", authMiddleware, requireRole("ADMIN"), (req, res) => {
  productImageController.deleteImage(req, res);
});
var productImageRouter_default = router3;

// dist/routes/index.js
var router4 = (app2) => {
  app2.use("/", userRouter_default);
  app2.use("/", productRouter_default);
  app2.use("/", productImageRouter_default);
};
var routes_default = router4;

// dist/app.js
var import_cors = __toESM(require("cors"), 1);
var import_path4 = __toESM(require("path"), 1);
var import_fs4 = __toESM(require("fs"), 1);
var import_url = require("url");
var import_path5 = require("path");
var import_meta = {};
var app = (0, import_express4.default)();
app.use((0, import_cors.default)({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", (0, import_cors.default)());
app.use(import_express4.default.json());
var imagesDir = process.env.VERCEL ? "/tmp/imagens" : import_path4.default.join(process.cwd(), "src", "imagens");
if (!import_fs4.default.existsSync(imagesDir)) {
  import_fs4.default.mkdirSync(imagesDir, { recursive: true });
}
app.use("/imagens", import_express4.default.static(imagesDir));
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = (0, import_path5.dirname)(__filename);
app.use(import_express4.default.static(import_path4.default.join(__dirname, "..", "Tke_Front_end")));
routes_default(app);
app.get("/", (req, res) => {
  res.sendFile(import_path4.default.join(__dirname, "..", "Tke_Front_end", "index.html"));
});
app.get("*", (req, res) => {
  res.sendFile(import_path4.default.join(__dirname, "..", "Tke_Front_end", "index.html"));
});

// dist/controller/Product-Image/service/removeImageProductFileLocal.service.js
var productImageService6 = new ProductImageService();
async function removeImageFile(id) {
  const image = await productImageService6.findById(id);
  if (!image) {
    throw new Error("Imagem n\xE3o encontrada");
  }
  const fileName = image.imagem;
  const filePath = import_path6.default.join(imagesDir, fileName);
  if (import_fs5.default.existsSync(filePath)) {
    import_fs5.default.unlinkSync(filePath);
    console.log("Arquivo deletado localmente:", filePath);
  } else {
    console.warn("Arquivo n\xE3o encontrado localmente:", filePath);
  }
  await productImageService6.delete(id);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  removeImageFile
});

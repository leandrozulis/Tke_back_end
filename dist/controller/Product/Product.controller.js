import ProductService from "../../services/Product.service.js";
import ProductImageService from "../../services/ProductImage.service.js";
import cache from '../../services/Cache.service.js';
import * as xlsx from "xlsx";
import { removeImageFile } from "../Product-Image/service/removeImageProductFileLocal.service.js";
const productService = new ProductService();
const productImageService = new ProductImageService();
export default class ProductController {
    async findById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ erro: "Parâmetro 'id' é obrigatório para busca por ID" });
            }
            const product = await productService.findById(id);
            if (!product) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }
    async findProduct(req, res) {
        try {
            const products = await productService.findAll();
            return res.status(200).json(products);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao buscar produtos" });
        }
    }
    async findUniqueProduct(req, res) {
        try {
            const { filial, referencia } = req.query;
            if (!referencia) {
                return res.status(400).json({ erro: "Valores aceitos de referência: codigoGis, numeroMaterial, descricao, deposito, posicaoDeposito" });
            }
            const product = await productService.findUnique(filial, referencia);
            if (!product) {
                return res.status(404).json({ erro: "Produto não encontrado" });
            }
            return res.status(200).json(product);
        }
        catch (error) {
            return res.status(500).json({ error: "Erro ao buscar produto" });
        }
    }
    async createProduct(req, res) {
        try {
            const { filial, codigoGis, numeroMaterial, descricao, deposito, posicaoDeposito, hierarquiaProduto } = req.body;
            if (!filial ||
                !codigoGis ||
                !numeroMaterial ||
                !descricao ||
                !deposito ||
                !posicaoDeposito ||
                !hierarquiaProduto) {
                return res.status(400).json({
                    error: "Campos obrigatórios não informados."
                });
            }
            const findProduct = await productService.findByFilialAndCodigoGis(filial, codigoGis);
            if (findProduct) {
                return res.status(200).json({
                    message: "Produto já cadastrado para essa filial"
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
        }
        catch (error) {
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
                    message: "Nenhum dado válido para atualização fornecido.",
                });
            }
            await productService.update(id, finalPayload);
            return res.status(200).json({
                message: "Produto atualizado com sucesso",
            });
        }
        catch (error) {
            if (error.meta.target) {
                return res.status(400).json({
                    error: `Erro ao atualizar produto, ${error.meta.target} já cadastrado no sistema`
                });
            }
            return res.status(404).json({ erro: "Produto não encontrado" });
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
                }
                catch (error) {
                    console.error("Erro ao deletar imagem associada:", error);
                }
            }
            await productService.delete(id);
            return res.status(200).json({ message: "Produto deletado com sucesso" });
        }
        catch (error) {
            return res.status(404).json({ erro: "Produto não encontrado." });
        }
    }
    async autocompleteProduct(req, res) {
        try {
            const { filial, referencia } = req.query;
            if (!referencia || referencia.length < 2) {
                return res.status(200).json([]);
            }
            const cacheKey = `autocomplete:${filial}:${referencia}`;
            const cachedResult = await cache.get(cacheKey);
            if (cachedResult) {
                return res.status(200).json(cachedResult);
            }
            const products = await productService.autocomplete(filial, referencia);
            // Cache por 5 minutos
            await cache.set(cacheKey, products, 300);
            return res.status(200).json(products);
        }
        catch (error) {
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
            // --- FIX: Converted Function Declarations to Function Expressions ---
            // Function Expression for key normalization
            const normalizarChave = (str) => {
                return str
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/\s+/g, "_")
                    .replace(/[^\w]/g, "")
                    .toLowerCase();
            };
            // Function Expression for object normalization
            const normalizarObjeto = (obj) => {
                const novo = {};
                for (const chave in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, chave)) {
                        novo[normalizarChave(chave)] = obj[chave];
                    }
                }
                return novo;
            };
            // --- Continue with existing logic ---
            const workbook = xlsx.read(req.file.buffer);
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const data = xlsx.utils.sheet_to_json(sheet);
            const dadosNormalizados = data.map(normalizarObjeto);
            let importados = 0;
            for (const item of dadosNormalizados) {
                // ... (productService.create logic remains the same)
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
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({
                sucesso: false,
                erro: "Erro ao importar Excel"
            });
        }
    }
    async exportExcel(req, res) {
        try {
            // 1️⃣ Buscar dados no banco
            const produtos = await productService.findAll();
            // ajuste para o método real do seu service
            if (!produtos || produtos.length === 0) {
                return res.status(404).json({ error: "Nenhum dado para exportar" });
            }
            const dadosFormatados = produtos.map((p) => ({
                Filial: p.filial,
                "Código GIS": p.codigoGis,
                "Número do Material": p.numeroMaterial,
                Descrição: p.descricao,
                Depósito: p.deposito,
                "Posição Depósito": p.posicaoDeposito,
                "Hierarquia do Produto": p.hierarquiaProduto
            }));
            // 2️⃣ Converter dados para planilha
            const worksheet = xlsx.utils.json_to_sheet(dadosFormatados);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, "Produtos");
            // 3️⃣ Gerar buffer do Excel
            const buffer = xlsx.write(workbook, {
                type: "buffer",
                bookType: "xlsx"
            });
            // 4️⃣ Configurar headers para download
            res.setHeader("Content-Disposition", "attachment; filename=produtos.xlsx");
            res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            // 5️⃣ Enviar arquivo
            return res.send(buffer);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Erro ao exportar Excel"
            });
        }
    }
}

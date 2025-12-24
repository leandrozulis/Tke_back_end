import z from "zod";
const createZod = z.object({
    filial: z.string(),
    codigoGis: z.string(),
    numeroMaterial: z.string(),
    descricao: z.string(),
    deposito: z.string(),
    posicaoDeposito: z.string(),
    hierarquiaProduto: z.string(),
});

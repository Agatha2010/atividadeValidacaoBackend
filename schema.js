const { z } = require("zod");

const usuarioSchema = z
  .object({
    nome: z
      .string()
      .trim()
      .min(3, "O nome deve ter no mínimo 3 caracteres.")
      .max(100, "O nome deve ter no máximo 100 caracteres."),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("O formato do e-mail é inválido."),

    idade: z
      .number()
      .int("A idade deve ser um número inteiro.")
      .min(18, "A idade deve ser maior ou igual a 18."),

    status_assinatura: z
      .enum(["PENDENTE", "ATIVO", "CANCELADO"])
      .default("PENDENTE"),

    periodo: z
      .object({
        data_inicio: z.string().datetime({
          offset: true,
          message: "A data de início deve estar no formato ISO 8601.",
        }),
        data_fim: z.string().datetime({
          offset: true,
          message: "A data de fim deve estar no formato ISO 8601.",
        }),
      })
      .superRefine((periodo, contexto) => {
        const inicio = Date.parse(periodo.data_inicio);
        const fim = Date.parse(periodo.data_fim);

        if (!Number.isNaN(inicio) && !Number.isNaN(fim) && fim <= inicio) {
          contexto.addIssue({
            code: "custom",
            path: ["data_fim"],
            message: "A data de fim deve ser posterior à data de início.",
          });
        }
      }),
  })
  .strict();

module.exports = { usuarioSchema };
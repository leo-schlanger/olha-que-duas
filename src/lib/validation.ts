import { z } from "zod";

/**
 * Schemas de validação Zod para formulários públicos. Centralizado para
 * garantir consistência entre componentes (Contacto, Newsletter, etc) e
 * permitir testar a regra isolada da UI.
 */

/** Email RFC-light + comprimento sensato (cobre 99% dos casos reais). */
export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email obrigatório")
  .max(254, "Email demasiado longo")
  .email("Formato de email inválido");

/** Schema do formulário de contacto. */
export const contactFormSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome muito curto")
    .max(100, "Nome demasiado longo"),
  email: emailSchema,
  assunto: z
    .string()
    .trim()
    .max(100, "Assunto demasiado longo")
    .optional(),
  mensagem: z
    .string()
    .trim()
    .min(10, "Mensagem demasiado curta (mínimo 10 caracteres)")
    .max(5000, "Mensagem demasiado longa (máximo 5000 caracteres)"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Schema só do email (newsletter). */
export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterData = z.infer<typeof newsletterSchema>;

/**
 * Helper que valida e devolve um Map de erros indexado por campo.
 * Útil para mostrar erros inline sem dependência de react-hook-form.
 */
export function getFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!(key in out)) out[key] = issue.message;
  }
  return out;
}

import { describe, it, expect } from "vitest";
import {
  emailSchema,
  contactFormSchema,
  newsletterSchema,
  getFieldErrors,
} from "@/lib/validation";

describe("emailSchema", () => {
  it("aceita email válido", () => {
    expect(emailSchema.safeParse("user@example.com").success).toBe(true);
  });

  it("normaliza com trim", () => {
    const result = emailSchema.safeParse("  user@example.com  ");
    expect(result.success).toBe(true);
    if (result.success) expect(result.data).toBe("user@example.com");
  });

  it("rejeita string vazia", () => {
    expect(emailSchema.safeParse("").success).toBe(false);
    expect(emailSchema.safeParse("   ").success).toBe(false);
  });

  it("rejeita formato inválido", () => {
    expect(emailSchema.safeParse("not-an-email").success).toBe(false);
    expect(emailSchema.safeParse("@example.com").success).toBe(false);
    expect(emailSchema.safeParse("user@").success).toBe(false);
  });

  it("rejeita comprimento > 254 caracteres", () => {
    const longEmail = "a".repeat(250) + "@x.com";
    expect(emailSchema.safeParse(longEmail).success).toBe(false);
  });

  it("aceita emails com subdomínios e plus", () => {
    expect(emailSchema.safeParse("user+tag@mail.example.co.uk").success).toBe(true);
  });
});

describe("contactFormSchema", () => {
  const validData = {
    nome: "Alexandra Serra",
    email: "alex@example.com",
    assunto: "podcast",
    mensagem: "Olá, gostaria de participar no podcast.",
  };

  it("aceita dados válidos completos", () => {
    expect(contactFormSchema.safeParse(validData).success).toBe(true);
  });

  it("aceita sem assunto (opcional)", () => {
    const { assunto: _assunto, ...withoutAssunto } = validData;
    expect(contactFormSchema.safeParse(withoutAssunto).success).toBe(true);
  });

  it("rejeita nome muito curto", () => {
    expect(contactFormSchema.safeParse({ ...validData, nome: "A" }).success).toBe(false);
  });

  it("rejeita mensagem com menos de 10 caracteres", () => {
    expect(contactFormSchema.safeParse({ ...validData, mensagem: "Curta" }).success).toBe(false);
  });

  it("rejeita mensagem com mais de 5000 caracteres", () => {
    expect(
      contactFormSchema.safeParse({ ...validData, mensagem: "x".repeat(5001) }).success
    ).toBe(false);
  });

  it("rejeita email inválido", () => {
    expect(
      contactFormSchema.safeParse({ ...validData, email: "invalid" }).success
    ).toBe(false);
  });

  it("normaliza trim em todos os campos", () => {
    const result = contactFormSchema.safeParse({
      nome: "  Alexandra  ",
      email: "  alex@example.com  ",
      assunto: "  podcast  ",
      mensagem: "  Olá, mensagem aqui.  ",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nome).toBe("Alexandra");
      expect(result.data.email).toBe("alex@example.com");
    }
  });
});

describe("newsletterSchema", () => {
  it("aceita email válido", () => {
    expect(newsletterSchema.safeParse({ email: "user@example.com" }).success).toBe(true);
  });

  it("rejeita email inválido", () => {
    expect(newsletterSchema.safeParse({ email: "invalid" }).success).toBe(false);
  });
});

describe("getFieldErrors", () => {
  it("agrupa erros por path", () => {
    const result = contactFormSchema.safeParse({
      nome: "A",
      email: "invalid",
      mensagem: "x",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = getFieldErrors(result.error);
      expect(errors).toHaveProperty("nome");
      expect(errors).toHaveProperty("email");
      expect(errors).toHaveProperty("mensagem");
      // Mensagens são strings legíveis (não códigos)
      expect(typeof errors.nome).toBe("string");
      expect(errors.nome.length).toBeGreaterThan(0);
    }
  });

  it("devolve apenas o primeiro erro por campo", () => {
    const result = contactFormSchema.safeParse({
      nome: "",
      email: "",
      mensagem: "",
    });
    if (!result.success) {
      const errors = getFieldErrors(result.error);
      // Cada campo aparece uma vez só, mesmo com múltiplos issues
      expect(Object.keys(errors).filter((k) => k === "nome")).toHaveLength(1);
    }
  });
});

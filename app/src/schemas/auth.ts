import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Nome muito curto')
      .max(100, 'Nome muito longo'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme a senha'),
    acceptedTerms: z.literal(true, {
      message: 'Você precisa aceitar os Termos e a Política de Privacidade',
    }),
    optNotifications: z.boolean().optional().default(false),
    optLocation: z.boolean().optional().default(false),
    optMarketing: z.boolean().optional().default(false),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ['confirmPassword'],
    message: 'As senhas não coincidem',
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z
  .object({
    email: z.string().email('Email inválido'),
    code: z.string().min(6, 'Código deve ter 6 dígitos').max(6),
    newPassword: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Nome muito curto').max(100).optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

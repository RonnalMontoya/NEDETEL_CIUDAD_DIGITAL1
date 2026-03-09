import { z } from 'zod';

const nombresRegex = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ ]+$/;
const usernameRegex = /^[a-z0-9._-]+$/;
const passwordComplexity = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const nombresSchema = z
  .string()
  .trim()
  .min(3, 'Ingresa al menos 3 caracteres en nombres.')
  .max(80, 'Nombres no puede superar 80 caracteres.')
  .regex(nombresRegex, 'Nombres solo admite letras y espacios.');

const usernameSchema = z
  .string()
  .trim()
  .min(4, 'El usuario debe tener mínimo 4 caracteres.')
  .max(20, 'El usuario no puede superar 20 caracteres.')
  .regex(
    usernameRegex,
    'El usuario solo permite minúsculas, números, punto, guion y guion bajo.'
  );

const correoSchema = z
  .string()
  .trim()
  .email('Ingresa un correo válido, por ejemplo usuario@dominio.com.')
  .max(120, 'El correo no puede superar 120 caracteres.');

const claveSchema = z
  .string()
  .min(8, 'La contraseña debe tener mínimo 8 caracteres.')
  .max(64, 'La contraseña no puede superar 64 caracteres.')
  .regex(
    passwordComplexity,
    'La contraseña debe incluir mayúscula, minúscula, número y símbolo.'
  );

const confirmarClaveSchema = z
  .string()
  .min(1, 'Confirma tu contraseña para continuar.');

export const registerSchema = z
  .object({
    nombres: nombresSchema,
    usuario: usernameSchema,
    correo: correoSchema,
    clave: claveSchema,
    confirmarClave: confirmarClaveSchema,
  })
  .superRefine((data, ctx) => {
    if (data.clave !== data.confirmarClave) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La confirmación no coincide con la contraseña.',
        path: ['confirmarClave'],
      });
    }
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterField = keyof RegisterFormData;
export type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

const fieldSchemas: Record<RegisterField, z.ZodType<string>> = {
  nombres: nombresSchema,
  usuario: usernameSchema,
  correo: correoSchema,
  clave: claveSchema,
  confirmarClave: confirmarClaveSchema,
};

export function validateRegisterField(
  field: RegisterField,
  values: RegisterFormData
): string | null {
  const parsed = fieldSchemas[field].safeParse(values[field]);
  if (!parsed.success) {
    return parsed.error.issues[0]?.message ?? 'Campo inválido.';
  }

  if (field === 'confirmarClave' && values.clave !== values.confirmarClave) {
    return 'La confirmación no coincide con la contraseña.';
  }

  return null;
}

export function validateRegisterForm(values: RegisterFormData): RegisterFieldErrors {
  const parsed = registerSchema.safeParse(values);
  if (parsed.success) {
    return {};
  }

  const errors: RegisterFieldErrors = {};
  for (const issue of parsed.error.issues) {
    const field = issue.path[0] as RegisterField | undefined;
    if (field && !errors[field]) {
      errors[field] = issue.message;
    }
  }

  return errors;
}
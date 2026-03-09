-- CreateEnum
DO $$
BEGIN
    CREATE TYPE "Rol" AS ENUM ('ADMIN', 'OPERADOR', 'OPERACIONES', 'TECNICO', 'SEGURIDAD', 'USER');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- IMPORTANT: drop old defaults BEFORE type conversion (prevents P3006 in shadow DB)
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "Usuario" ALTER COLUMN "rol" DROP DEFAULT;

-- AlterTable: User.role -> Rol
ALTER TABLE "User"
ALTER COLUMN "role" TYPE "Rol"
USING (
    CASE
        WHEN UPPER(TRIM("role")) IN ('ADMIN', 'OPERADOR', 'OPERACIONES', 'TECNICO', 'SEGURIDAD', 'USER')
            THEN UPPER(TRIM("role"))::"Rol"
        ELSE 'OPERADOR'::"Rol"
    END
);

-- Set DEFAULT after conversion (must be a valid enum value)
ALTER TABLE "User"
ALTER COLUMN "role" SET DEFAULT 'OPERADOR'::"Rol";

-- AlterTable: Usuario.rol -> Rol
ALTER TABLE "Usuario"
ALTER COLUMN "rol" TYPE "Rol"
USING (
    CASE
        WHEN UPPER(TRIM("rol")) IN ('ADMIN', 'OPERADOR', 'OPERACIONES', 'TECNICO', 'SEGURIDAD', 'USER')
            THEN UPPER(TRIM("rol"))::"Rol"
        ELSE 'USER'::"Rol"
    END
);

-- Set DEFAULT after conversion (must be a valid enum value)
ALTER TABLE "Usuario"
ALTER COLUMN "rol" SET DEFAULT 'USER'::"Rol";
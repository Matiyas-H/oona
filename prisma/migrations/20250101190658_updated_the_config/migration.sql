-- AlterTable
ALTER TABLE "user_numbers" ADD COLUMN     "aiConfigId" TEXT;

-- CreateTable
CREATE TABLE "ai_configs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "greeting" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "questions" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_configs_userId_idx" ON "ai_configs"("userId");

-- AddForeignKey
ALTER TABLE "user_numbers" ADD CONSTRAINT "user_numbers_aiConfigId_fkey" FOREIGN KEY ("aiConfigId") REFERENCES "ai_configs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_configs" ADD CONSTRAINT "ai_configs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

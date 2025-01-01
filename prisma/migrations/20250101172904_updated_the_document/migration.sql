-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "s3Key" TEXT NOT NULL,
    "vectorId" TEXT,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING',
    "telyxNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "documents_telyxNumber_idx" ON "documents"("telyxNumber");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_telyxNumber_fkey" FOREIGN KEY ("telyxNumber") REFERENCES "user_numbers"("telyxNumber") ON DELETE CASCADE ON UPDATE CASCADE;

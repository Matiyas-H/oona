-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('READ', 'UNREAD');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "countries" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "iso_code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forwarding_codes" (
    "id" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "serviceType" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activateFormat" TEXT NOT NULL,
    "deactivateFormat" TEXT NOT NULL,

    CONSTRAINT "forwarding_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_numbers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "telyxNumber" TEXT NOT NULL,
    "userName" TEXT,
    "aiGreeting" TEXT,
    "aiContext" TEXT,
    "aiQuestions" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "carrierId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,

    CONSTRAINT "user_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_services" (
    "id" TEXT NOT NULL,
    "userNumberId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "forwardingCodeId" TEXT NOT NULL,
    "gsmCode" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "lastDialed" TIMESTAMP(3),

    CONSTRAINT "user_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_purchases" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "twilioNumber" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "failed_purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "failed_services" (
    "id" TEXT NOT NULL,
    "userNumberId" TEXT NOT NULL,
    "error" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "failed_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verified_numbers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verified_numbers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "telyxNumber" TEXT NOT NULL,
    "callerName" TEXT NOT NULL,
    "callerNumber" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "messageNotifications" BOOLEAN NOT NULL DEFAULT true,
    "firebaseDeviceToken" TEXT,
    "pushSubscription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");

-- CreateIndex
CREATE UNIQUE INDEX "countries_iso_code_key" ON "countries"("iso_code");

-- CreateIndex
CREATE INDEX "carriers_countryId_idx" ON "carriers"("countryId");

-- CreateIndex
CREATE UNIQUE INDEX "carriers_name_countryId_key" ON "carriers"("name", "countryId");

-- CreateIndex
CREATE INDEX "forwarding_codes_carrierId_idx" ON "forwarding_codes"("carrierId");

-- CreateIndex
CREATE UNIQUE INDEX "forwarding_codes_carrierId_serviceType_key" ON "forwarding_codes"("carrierId", "serviceType");

-- CreateIndex
CREATE UNIQUE INDEX "user_numbers_userId_key" ON "user_numbers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_numbers_telyxNumber_key" ON "user_numbers"("telyxNumber");

-- CreateIndex
CREATE INDEX "user_numbers_carrierId_idx" ON "user_numbers"("carrierId");

-- CreateIndex
CREATE INDEX "user_numbers_countryId_idx" ON "user_numbers"("countryId");

-- CreateIndex
CREATE INDEX "user_services_userNumberId_idx" ON "user_services"("userNumberId");

-- CreateIndex
CREATE INDEX "user_services_carrierId_idx" ON "user_services"("carrierId");

-- CreateIndex
CREATE INDEX "user_services_forwardingCodeId_idx" ON "user_services"("forwardingCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "user_services_userNumberId_carrierId_forwardingCodeId_key" ON "user_services"("userNumberId", "carrierId", "forwardingCodeId");

-- CreateIndex
CREATE UNIQUE INDEX "verified_numbers_userId_key" ON "verified_numbers"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "verified_numbers_number_key" ON "verified_numbers"("number");

-- CreateIndex
CREATE INDEX "messages_telyxNumber_idx" ON "messages"("telyxNumber");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- AddForeignKey
ALTER TABLE "carriers" ADD CONSTRAINT "carriers_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "forwarding_codes" ADD CONSTRAINT "forwarding_codes_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_numbers" ADD CONSTRAINT "user_numbers_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_numbers" ADD CONSTRAINT "user_numbers_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_numbers" ADD CONSTRAINT "user_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_services" ADD CONSTRAINT "user_services_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "carriers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_services" ADD CONSTRAINT "user_services_forwardingCodeId_fkey" FOREIGN KEY ("forwardingCodeId") REFERENCES "forwarding_codes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_services" ADD CONSTRAINT "user_services_userNumberId_fkey" FOREIGN KEY ("userNumberId") REFERENCES "user_numbers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "verified_numbers" ADD CONSTRAINT "verified_numbers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_telyxNumber_fkey" FOREIGN KEY ("telyxNumber") REFERENCES "user_numbers"("telyxNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

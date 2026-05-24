-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";
CREATE EXTENSION IF NOT EXISTS citext;

-- CreateTable
CREATE TABLE "customers" (
    "id" SERIAL NOT NULL,
    "customer" VARCHAR(255),
    "email" CITEXT NOT NULL,
    "password" VARCHAR(255),
    "stage" VARCHAR(255),
    "avatar" VARCHAR(255),
    "album" TEXT[],
    "likes" TEXT[],
    "dob" VARCHAR(255),
    "age" VARCHAR(255),
    "gender" VARCHAR(255),
    "interest" VARCHAR(255),
    "dates" JSONB,
    "credits" DECIMAL(4,0),
    "reftoken" VARCHAR(255),

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venues" (
    "id" SERIAL NOT NULL,
    "venue" VARCHAR(255) NOT NULL,
    "email" CITEXT NOT NULL,
    "password" VARCHAR(255),
    "stage" VARCHAR(255),
    "avatar" VARCHAR(255),
    "album" TEXT[],
    "likes" TEXT[],
    "rating" DECIMAL(2,1),
    "hours" VARCHAR(255),
    "tables" JSONB,
    "auctions" JSONB,
    "dates" JSONB,
    "credits" DECIMAL(4,0),
    "reftoken" VARCHAR(255),

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "venues_venue_key" ON "venues"("venue");

-- CreateIndex
CREATE UNIQUE INDEX "venues_email_key" ON "venues"("email");

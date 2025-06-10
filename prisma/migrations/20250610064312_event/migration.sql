-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'VENDOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "VendorCategory" AS ENUM ('PHOTOGRAPHY', 'CATERING', 'MUSIC', 'VENUE', 'DECORATION', 'CAKE', 'FLOWERS', 'DRESS', 'MAKEUP', 'TRANSPORTATION', 'OTHER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('WEDDING', 'BIRTHDAY', 'CORPORATE', 'BABY_SHOWER', 'ANNIVERSARY', 'GRADUATION', 'HOLIDAY', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "fullname" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255),
    "passwordhash" TEXT NOT NULL,
    "role" VARCHAR(50) NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userid" UUID NOT NULL,
    "businessname" VARCHAR(255) NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "minprice" INTEGER NOT NULL,
    "maxprice" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "description" TEXT NOT NULL,
    "profileimg" TEXT,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "vendorid" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "availability" JSONB,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userid" UUID NOT NULL,
    "eventtype" VARCHAR(50) NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "date" DATE NOT NULL,
    "budget" INTEGER NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVendor" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "eventid" UUID NOT NULL,
    "vendorid" UUID NOT NULL,
    "serviceid" UUID NOT NULL,
    "agreedprice" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventVendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userid" UUID NOT NULL,
    "vendorid" UUID NOT NULL,
    "eventid" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "reviewtext" TEXT,
    "createdat" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_userid_key" ON "Vendor"("userid");

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_vendorid_fkey" FOREIGN KEY ("vendorid") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EventVendor" ADD CONSTRAINT "EventVendor_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EventVendor" ADD CONSTRAINT "EventVendor_serviceid_fkey" FOREIGN KEY ("serviceid") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "EventVendor" ADD CONSTRAINT "EventVendor_vendorid_fkey" FOREIGN KEY ("vendorid") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_eventid_fkey" FOREIGN KEY ("eventid") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_vendorid_fkey" FOREIGN KEY ("vendorid") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventType" ADD VALUE 'CONFERENCE';
ALTER TYPE "EventType" ADD VALUE 'SEMINAR';
ALTER TYPE "EventType" ADD VALUE 'WORKSHOP';
ALTER TYPE "EventType" ADD VALUE 'GALA';
ALTER TYPE "EventType" ADD VALUE 'FUNDRAISER';
ALTER TYPE "EventType" ADD VALUE 'SPORTING_EVENT';
ALTER TYPE "EventType" ADD VALUE 'FESTIVAL';
ALTER TYPE "EventType" ADD VALUE 'TRADE_SHOW';
ALTER TYPE "EventType" ADD VALUE 'ART_EXHIBITION';
ALTER TYPE "EventType" ADD VALUE 'MUSIC_CONCERT';
